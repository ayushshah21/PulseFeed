from flask import Flask, request
from google_news_feed import GoogleNewsFeed

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def main():
    keywords = request.args.get("keywords")
    print("Hello World")
    gnf = GoogleNewsFeed(language="en", country="US")
    results = gnf.query(keywords)
    # print(results)
    # if not keywords:
    #     return "No Keywords provided", 400
    return results


if __name__ == "__main__":
    app.run(debug=True)
