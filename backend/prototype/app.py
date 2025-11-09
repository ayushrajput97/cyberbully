from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BertTokenizer, BertForSequenceClassification
import torch

app = Flask(__name__)
CORS(app)  # allows requests from React frontend

# ✅ Load your fine-tuned model instead of base model
MODEL_PATH = "model"
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)
model = BertForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()

@app.route('/')
def home():
    return jsonify({"message": "Backend running!"})

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # ✅ Get actual prediction
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1).tolist()[0]

    # ✅ Convert to label
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

if __name__ == '__main__':
    app.run(debug=True)
