import os
import praw
import json
from dotenv import load_dotenv

load_dotenv()

reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT")
)

def fetch_reddit(subreddit_name="teenagers", limit=50):
    data = []
    for comment in reddit.subreddit(subreddit_name).comments(limit=limit):
        data.append({
            "platform": "Reddit",
            "text": comment.body,
            "timestamp": str(comment.created_utc),
            "user": str(comment.author)
        })
    os.makedirs("../data", exist_ok=True)
    with open("../data/raw_reddit.json", "w") as f:
        json.dump(data, f, indent=4)
    print(f"✅ Saved {len(data)} Reddit comments to data/raw_reddit.json")

if __name__ == "__main__":
    fetch_reddit()
