from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np

class ToxicClassifier:
    def __init__(self, model_path):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSequenceClassification.from_pretrained(model_path)
        self.model.eval()
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

    def predict(self, texts, batch_size=16):
        all_out = []
        for i in range(0, len(texts), batch_size):
            batch = texts[i:i+batch_size]
            enc = self.tokenizer(batch, return_tensors="pt", truncation=True, padding=True, max_length=128)
            enc = {k:v.to(self.device) for k,v in enc.items()}
            with torch.no_grad():
                out = self.model(**enc)
                probs = torch.softmax(out.logits, dim=-1).cpu().numpy()
                for p in probs:
                    all_out.append({"label": int(p.argmax()), "scores": p.tolist()})
        return all_out
