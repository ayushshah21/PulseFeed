from flask import Flask, request
from google_news_feed import GoogleNewsFeed
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
import os
from flask import redirect, url_for, session
from flask_cors import CORS
import secrets
from authlib.integrations.flask_client import OAuth
from flask import jsonify
import datetime
import jwt
from openai import OpenAI
import psycopg2
from psycopg2.extras import RealDictCursor
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random
from apscheduler.schedulers.background import BackgroundScheduler
import os
from supabase import create_client, Client



app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)
load_dotenv()
oauth = OAuth(app)
JWT_SECRET = "your_jwt_secret"
JWT_ALGORITHM = "HS256"
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)





client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
)


@app.route("/test-cors")
def test_cors():
    return "CORS should be enabled for this response."




# Google OAuth Config
oauth.register(
    name="google",
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    access_token_params=None,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={"scope": "openid profile email"},
)


def format_articles(articles):
    email_body = "<h1>How's It Going Gym Boy 💪</h1>"
    for article in articles[:10]:  # Currently I'm only sending top 10 articles
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": f"""Could you summarize this article: Make sure the summary is concise and 
                appealing/easy to understand to its readers to make them want to read the rest of the 
                article: 2 sentences max {article.link}""",
                }
            ],
            model="gpt-3.5-turbo",
        )
        content = response.choices[0].message.content
        print(response)
        email_body += f"""
            <div>
                <h2 style="color:black;">{article.title}</h2> 
                <p>{content}</p>  
                <p><a href="{article.link}">Read more</a></p> 
                <p>Published on: {article.pubDate}</p> 
                <hr>
            </div>
        """
    return email_body


def send_email(recipient, email_body):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    smtp_user = "pulsefeed23@gmail.com"
    smtp_password = os.environ.get(
        "GMAIL_PASSWORD"
    )  # Consider using environment variables or a secure method to store this

    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Daily News Digest"
    message["From"] = smtp_user
    message["To"] = recipient

    # Attach the HTML body
    message.attach(MIMEText(email_body, "html"))

    # Send the email
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, recipient, message.as_string())
    server.quit()


@app.route("/", methods=["GET", "POST"])
def main():
    keywords_string = request.args.get("keywords")
    if not keywords_string:
        return "No Keywords provided", 400
    # Split the keywords string into a list
    keywords_list = [keyword.strip() for keyword in keywords_string.split(",")]
    print(keywords_string)
    # print("Hello World")
    all_articles = []
    gnf = GoogleNewsFeed(language="en", country="US")
    for keyword in keywords_list:
        # Query the Google RSS feed for each keyword
        print(f"Querying for keyword: {keyword}")
        articles = gnf.query(keyword)

        # Get the top 3-5 articles for each keyword (adjust the range as needed)
        top_articles = articles[:4]
        all_articles.extend(top_articles)
    # print(results)
    # response = client.chat.completions.create(
    #     messages=[
    #         {
    #             "role": "user",
    #             "content": f"can you turn the following phrase into keywords, which i can use to input into the google news rss feed to search for articles effectively: {keywords}",
    #         }
    #     ],
    #     model="gpt-3.5-turbo",
    # )
    # print(response)
    # results = gnf.query(keywords)

    random.shuffle(all_articles)
    email_body = format_articles(all_articles)
    send_email("aashah2003@gmail.com", email_body)

    return "Email sent successfully!"


@app.route("/login")
def login():
    google = oauth.create_client("google")
    redirect_uri = url_for("authorize", _external=True)
    return google.authorize_redirect(redirect_uri)


@app.route("/authorize")
def authorize():
    google = oauth.create_client("google")
    token = google.authorize_access_token()
    resp = google.get("userinfo")
    resp.raise_for_status()
    user_info = resp.json()
    # do something with the token and profile
    session["email"] = user_info["email"]
    # Create a JWT token
    user_data = {
        "email": user_info["email"],
        "name": user_info.get("name"),
        "exp": datetime.datetime.utcnow()
        + datetime.timedelta(hours=1),  # Token expires in 1 hour
    }
    jwt_token = jwt.encode(user_data, JWT_SECRET, algorithm=JWT_ALGORITHM)

    # Redirect to the frontend with the token as a query parameter
    return redirect(f"http://localhost:5173?token={jwt_token}")


@app.route("/api/update_user", methods=["POST"])
def set_user_preferences():
    data = request.get_json()
    email = data.get("email")  # Assuming email is sent in the request
    topics = data["topics"]  # Assuming topics is a JSON string for the JSONB column
    frequency = data["frequency"]

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT 1 FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            # Update existing user
            cursor.execute(
                """
                UPDATE users
                SET TopicPreferences = %s, EmailFrequency = %s
                WHERE Email = %s
            """,
                (topics, frequency, email),
            )
        else:
            # Insert new user
            cursor.execute(
                """
                INSERT INTO users (Email, TopicPreferences, EmailFrequency, lastEmailSent, articleSent)
                VALUES (%s, %s, %s)
            """,
                (
                    email,
                    topics,
                    frequency,
                ),
            )

        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

    return jsonify({"status": "success"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
