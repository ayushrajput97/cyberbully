import json
import pandas as pd

files = ["../data/raw_twitter.json", "../data/raw_reddit.json", "../data/raw_youtube.json"]
merged = []

for file in files:
    try:
        with open(file, "r") as f:
            merged.extend(json.load(f))
    except:
        print(f"⚠️ Could not read {file}")

df = pd.DataFrame(merged)
df.to_json("../data/merged_data.json", orient="records", indent=4)
print(f"✅ Merged total {len(df)} records from all platforms")
