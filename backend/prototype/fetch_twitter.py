import os
import tweepy
import json
from dotenv import load_dotenv

load_dotenv()

bearer_token = os.getenv("TWITTER_BEARER")
client = tweepy.Client(bearer_token=bearer_token)

def fetch_tweets(query="#bullying OR #cyberbullying", max_results=50):
    tweets = client.search_recent_tweets(query=query, max_results=max_results, tweet_fields=["created_at", "text", "author_id"])
    data = [
        {
            "platform": "Twitter",
            "text": tweet.text,
            "timestamp": str(tweet.created_at),
            "user": tweet.author_id
        }
        for tweet in tweets.data
    ] if tweets.data else []
    with open("../data/raw_twitter.json", "w") as f:
        json.dump(data, f, indent=4)
    print(f"✅ Saved {len(data)} tweets")

if __name__ == "__main__":
    fetch_tweets()
