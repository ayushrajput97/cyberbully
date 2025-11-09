from flask import Flask, request, jsonify
from model import ToxicClassifier

app = Flask(__name__)
model = ToxicClassifier("saved_models/toxicbert")

@app.route("/health")
def health():
    return jsonify({"status":"ok"})

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    texts = data.get("texts") or [data.get("text")]
    results = model.predict(texts)
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
