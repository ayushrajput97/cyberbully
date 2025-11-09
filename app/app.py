from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import os
import random

# Import YouTube routes
from youtube_comments import youtube_bp   # ✅ Make sure file is named youtube_comments.py

app = Flask(__name__)
CORS(app)

# Register blueprint for YouTube analysis
app.register_blueprint(youtube_bp)

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "../saved_models/model")
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

@app.route("/")
def home():
    return jsonify({"message": "ML service running!"})


@app.route("/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json()
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1).tolist()[0]

    labels = ["non-bullying", "bullying"]
    predicted_label = labels[int(torch.argmax(torch.tensor(probs)))]

    return jsonify({
        "text": text,
        "predicted_label": predicted_label,
        "prediction": {
            "non-bullying": round(probs[0] * 100, 2),
            "bullying": round(probs[1] * 100, 2)
        }
    })


# ✅ Dummy stats routes for dashboard charts
@app.route("/api/youtube-stats", methods=["GET"])
def youtube_stats():
    return jsonify({
        "platform": "YouTube",
        "bullying_rate": round(random.uniform(10, 50), 2),
        "non_bullying_rate": round(random.uniform(50, 90), 2)
    })


@app.route("/api/twitter-stats", methods=["GET"])
def twitter_stats():
    return jsonify({
        "platform": "Twitter",
        "bullying_rate": round(random.uniform(15, 55), 2),
        "non_bullying_rate": round(random.uniform(45, 85), 2)
    })


@app.route("/api/reddit-stats", methods=["GET"])
def reddit_stats():
    return jsonify({
        "platform": "Reddit",
        "bullying_rate": round(random.uniform(5, 40), 2),
        "non_bullying_rate": round(random.uniform(60, 95), 2)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
