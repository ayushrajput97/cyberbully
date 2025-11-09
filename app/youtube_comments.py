from flask import Blueprint, jsonify, request
import requests
import os

youtube_bp = Blueprint("youtube_bp", __name__)

# ✅ Put your valid YouTube API key here
YOUTUBE_API_KEY = "AIzaSyD1OG2vug1ycuTXq3iD2z2dZiMXOUYYJtw"

@youtube_bp.route("/api/youtube-comments", methods=["GET"])
def fetch_youtube_comments():
    video_id = request.args.get("video_id")

    if not video_id:
        return jsonify({"error": "Missing video_id parameter"}), 400

    if not YOUTUBE_API_KEY or YOUTUBE_API_KEY == "YOUR_YOUTUBE_API_KEY":
        return jsonify({"error": "YouTube API key not set!"}), 500

    url = (
        f"https://www.googleapis.com/youtube/v3/commentThreads"
        f"?part=snippet&videoId={video_id}&key={YOUTUBE_API_KEY}&maxResults=10"
    )

    try:
        response = requests.get(url)
        data = response.json()

        # 🧠 Log the API response in your Flask console for debugging
        print("🔍 YOUTUBE API RESPONSE:", data)

        if "error" in data:
            return jsonify({"error": data["error"]["message"]}), 500

        comments = [
            {
                "author": item["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"],
                "text": item["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
            }
            for item in data.get("items", [])
        ]

        return jsonify({"video_id": video_id, "comments": comments})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
