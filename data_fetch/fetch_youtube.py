import os
import json
from googleapiclient.discovery import build
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("YOUTUBE_API_KEY")

def fetch_youtube_comments(video_id, max_results=50):
    youtube = build("youtube", "v3", developerKey=api_key)
    response = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=max_results,
        textFormat="plainText"
    ).execute()

    data = []
    for item in response.get("items", []):
        snippet = item["snippet"]["topLevelComment"]["snippet"]
        data.append({
            "platform": "YouTube",
            "text": snippet["textDisplay"],
            "timestamp": snippet["publishedAt"],
            "user": snippet["authorDisplayName"]
        })

    os.makedirs("../data", exist_ok=True)
    with open("../data/raw_youtube.json", "w") as f:
        json.dump(data, f, indent=4)
    print(f"✅ Saved {len(data)} YouTube comments to data/raw_youtube.json")

if __name__ == "__main__":
    fetch_youtube_comments("c8lrEzoT4Dk")
