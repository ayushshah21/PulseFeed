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

app = Flask(__name__)
CORS(app)
app.secret_key = secrets.token_hex(16)
load_dotenv()
oauth = OAuth(app)
JWT_SECRET = "your_jwt_secret"
JWT_ALGORITHM = "HS256"


client = OpenAI(
    # This is the default and can be omitted
    api_key=os.environ.get("OPENAI_API_KEY"),
)

# response = client.chat.completions.create(
    # messages=[
    #     {
    #         "role": "user",
    #         "content": "Tell me more about joel embiid",
    #     }
    # ],
    # model="gpt-3.5-turbo",
    # )
    # print(response)



@app.after_request
def after_request(response):
    app.logger.info(response.headers)
    return response


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


@app.route("/", methods=["GET", "POST"])
def main():
    keywords = request.args.get("keywords")
    # print("Hello World")
    gnf = GoogleNewsFeed(language="en", country="US")
    results = gnf.query(keywords)
    # print(results)
    if not keywords:
        return "No Keywords provided", 400
    # email = dict(session).get("email", None)

    return results


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


CREATE_USER_TABLE = "CREATE TABLE IF NOT EXISTS user"


@app.route("/api/user", methods=["POST"])
def setUserPreferences():
    data = request.get_json()
    topics = data["topics"]
    return topics.split(",")[1]


if __name__ == "__main__":
    app.run(debug=True, port=5001)
