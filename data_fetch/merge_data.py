import json
import pandas as pd
import os

os.makedirs("../data", exist_ok=True)
files = [
    "../data/raw_twitter.json",
    "../data/raw_reddit.json",
    "../data/raw_youtube.json"
]

merged = []
for file in files:
    try:
        with open(file, "r") as f:
            merged.extend(json.load(f))
    except Exception as e:
        print(f"⚠️ Could not read {file}: {e}")

df = pd.DataFrame(merged)
df.to_json("../data/merged_data.json", orient="records", indent=4)
print(f"✅ Merged total {len(df)} records into data/merged_data.json")
