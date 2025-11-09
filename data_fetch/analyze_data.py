import json
import requests
import os
from tqdm import tqdm
import pandas as pd

# ✅ URL of your Flask API (must be running before this script)
API_URL = "http://127.0.0.1:5001/analyze"

# ✅ Path to merged data
INPUT_FILE = "../data/merged_data.json"
OUTPUT_FILE = "../data/analyzed_data.json"

def analyze_texts():
    # Check file existence
    if not os.path.exists(INPUT_FILE):
        print(f"❌ {INPUT_FILE} not found. Run merge_data.py first.")
        return

    # Load merged data
    with open(INPUT_FILE, "r") as f:
        data = json.load(f)

    analyzed = []
    print(f"🔍 Sending {len(data)} texts to ML API...")

    for entry in tqdm(data):
        text = entry.get("text", "")
        if not text.strip():
            continue

        try:
            response = requests.post(API_URL, json={"text": text})
            if response.status_code == 200:
                result = response.json()
                entry["predicted_label"] = result["predicted_label"]
                entry["non_bullying_score"] = result["prediction"]["non-bullying"]
                entry["bullying_score"] = result["prediction"]["bullying"]
            else:
                entry["predicted_label"] = "error"
                entry["non_bullying_score"] = None
                entry["bullying_score"] = None
        except Exception as e:
            entry["predicted_label"] = "error"
            entry["non_bullying_score"] = None
            entry["bullying_score"] = None
            print(f"⚠️ Error analyzing text: {e}")

        analyzed.append(entry)

    # ✅ Save results
    os.makedirs("../data", exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(analyzed, f, indent=4)

    print(f"\n✅ Analysis complete! Saved results to {OUTPUT_FILE}")
    print(f"📊 Total analyzed entries: {len(analyzed)}")

    # Optional: summary report
    df = pd.DataFrame(analyzed)
    if "predicted_label" in df.columns:
        summary = df["predicted_label"].value_counts()
        print("\n=== Summary ===")
        print(summary)

if __name__ == "__main__":
    analyze_texts()
