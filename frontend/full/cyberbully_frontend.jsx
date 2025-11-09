/*
Project: Cyberbully Detector - React Frontend (single-file preview)

This file contains a complete React app (single-file) you can paste into a CRA/Vite project
as `src/App.jsx` (and the helper CSS into `src/App.css`).

It also contains a README, backend API specification, and sample Dockerfile + package.json
below this component. Read the README comments for full start-to-finish instructions.

--- Backend expectations (API endpoints)
1) POST /api/score
   Request JSON: { "text": "..." }
   Response JSON: { "label": "bullying"|"non-bullying", "scores": {"nonbullying":0.12, "bullying":0.88} }

2) GET /api/fetch?source=twitter|reddit|youtube&query=...&limit=10
   Response JSON: { "items": [ {"id":"...","text":"...","meta":{...} }, ... ] }

The frontend will call these endpoints. The README below shows sample backend code snippets.

--- How to use this document
1. Create a React app (create-react-app or Vite).
2. Replace `src/App.jsx` with the component below and add `src/App.css` (CSS provided after the code).
3. `npm install` then `npm start`.
4. Ensure backend API (Express + ML microservice) is running at the same origin or setup proxy.

*/

import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('twitter');
  const [query, setQuery] = useState('');
  const [fetchedItems, setFetchedItems] = useState([]);
  const [threshold, setThreshold] = useState(0.6);
  const [error, setError] = useState(null);

  // helper: call score API
  async function scoreText(t) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t })
      });
      if (!res.ok) throw new Error(`Score API failed: ${res.status}`);
      const data = await res.json();
      setResult(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }

  // fetch posts from selected source
  async function fetchFromSource() {
    if (!query) return;
    setError(null);
    try {
      const q = encodeURIComponent(query);
      const res = await fetch(`/api/fetch?source=${source}&query=${q}&limit=20`);
      if (!res.ok) throw new Error(`Fetch API failed: ${res.status}`);
      const data = await res.json();
      setFetchedItems(data.items || []);
    } catch (err) {
      setError(err.message);
    }
  }

  // batch score fetched items
  async function scoreFetchedItems() {
    if (!fetchedItems.length) return;
    setLoading(true);
    setError(null);
    try {
      // send batch to /api/score where backend accepts array
      const texts = fetchedItems.map(it => it.text);
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts })
      });
      if (!res.ok) throw new Error(`Score API failed: ${res.status}`);
      const data = await res.json(); // expect { results: [ { label, scores }, ... ] }
      const merged = fetchedItems.map((it, i) => ({ ...it, ml: data.results[i] || null }));
      setFetchedItems(merged);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // quick highlighter for a text and its scores
  function renderResult(r) {
    if (!r) return null;
    const bullyingScore = r.scores ? (r.scores.bullying ?? r.scores.toxic ?? r.scores[1]) : null;
    const nonBullyingScore = r.scores ? (r.scores.nonbullying ?? r.scores[0]) : null;
    const label = r.label || (bullyingScore >= (nonBullyingScore ?? 0) ? 'bullying' : 'non-bullying');
    return (
      <div className="result">
        <div className={`badge ${label === 'bullying' ? 'danger' : 'ok'}`}>{label.toUpperCase()}</div>
        <div className="scores">
          {r.scores && Object.entries(r.scores).map(([k,v]) => (
            <div key={k} className="score-line"><strong>{k}</strong>: {(v*100).toFixed(1)}%</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Cyberbully Detector — Frontend</h1>
        <p>Type a prompt or fetch posts from Twitter / Reddit / YouTube and score them using the ML model.</p>
      </header>

      <main>
        <section className="card">
          <h2>Single prompt score</h2>
          <textarea
            placeholder="Enter text to check for cyberbullying..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
          />
          <div className="controls">
            <button onClick={() => scoreText(text)} disabled={loading || !text}>Score Text</button>
            <button onClick={() => { setText(''); setResult(null); }}>Clear</button>
            <div className="inline-note">Threshold: <input type="number" min="0" max="1" step="0.05" value={threshold} onChange={e => setThreshold(parseFloat(e.target.value)||0)} /></div>
          </div>
          {loading && <div className="muted">Processing...</div>}
          {error && <div className="error">Error: {error}</div>}
          {renderResult(result)}
        </section>

        <section className="card">
          <h2>Fetch from source (Twitter / Reddit / YouTube)</h2>
          <div className="row">
            <label>Source:</label>
            <select value={source} onChange={e => setSource(e.target.value)}>
              <option value="twitter">Twitter</option>
              <option value="reddit">Reddit</option>
              <option value="youtube">YouTube</option>
            </select>
            <label>Query:</label>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="search query, hashtag, channel..." />
            <button onClick={fetchFromSource}>Fetch</button>
          </div>
          <div className="row small">
            <button onClick={scoreFetchedItems} disabled={loading || !fetchedItems.length}>Score fetched items</button>
            <div className="muted">Fetched: {fetchedItems.length}</div>
          </div>

          <div className="list">
            {fetchedItems.map((it, i) => {
              const ml = it.ml;
              const isFlagged = ml && ((ml.scores && (ml.scores.bullying ?? ml.scores.toxic ?? (ml.scores[1] || 0)) >= threshold) || ml.label === 'bullying');
              return (
                <div key={it.id || i} className={`list-item ${isFlagged ? 'flagged' : ''}`}>
                  <div className="meta">{it.meta?.author || it.meta?.title || it.meta?.subreddit || ''} — {it.meta?.date || ''}</div>
                  <div className="text">{it.text}</div>
                  <div className="ml">{ml ? renderResult(ml) : <div className="muted">Not scored</div>}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="card">
          <h2>Instructions / Notes</h2>
          <ol>
            <li>Run a backend that exposes <code>/api/score</code> and <code>/api/fetch</code>. See the API spec above (top of file) and README below.</li>
            <li>You can make <code>/api/score</code> accept either {"text":"..."} or {"texts":["a","b"]} for batch scoring.</li>
            <li>For social fetch endpoints, the backend should handle OAuth (Twitter), API keys (YouTube Data API), and Reddit (PRAW or Reddit API) and return a normalized item array.</li>
            <li>This frontend expects the ML to return `scores` where keys are descriptive (e.g., `nonbullying`, `bullying`) or positional array `[nonbullying, bullying]` — the frontend tries to handle common patterns.</li>
          </ol>
        </section>

      </main>

      <footer>
        <small>Cyberbully Detector • Frontend prototype • Make sure to secure API keys and user data when deploying.</small>
      </footer>
    </div>
  );
}

/* --- App.css (paste into src/App.css) ---
.app { font-family: Inter, Arial, sans-serif; max-width: 980px; margin: 20px auto; padding: 10px; }
header h1 { margin: 0 0 6px 0; }
.card { background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); padding:16px; margin:16px 0; }
textarea { width:100%; padding:8px; font-size:14px; border-radius:6px; border:1px solid #ddd; }
.controls { margin-top:8px; display:flex; gap:8px; align-items:center; }
button { padding:8px 12px; border-radius:6px; border: none; background:#2563eb; color:#fff; cursor:pointer; }
button:disabled { opacity:0.5; cursor:not-allowed; }
.inline-note { margin-left:12px; }
.list { margin-top:12px; }
.list-item { padding:10px; border-bottom:1px solid #f0f0f0; }
.list-item.flagged { background:#fff6f6; border-left:4px solid #f87171; }
.meta { color:#666; font-size:12px; margin-bottom:6px; }
.text { font-size:14px; margin-bottom:6px; }
.muted { color:#777; font-size:13px; }
.result { margin-top:10px; display:flex; gap:12px; align-items:center; }
.badge { padding:6px 10px; border-radius:999px; color:#fff; font-weight:600; }
.badge.ok { background:#10b981; }
.badge.danger { background:#ef4444; }
.scores { font-size:13px; }
.score-line { margin-bottom:4px; }
.error { color:#c62828; margin-top:8px; }
.row { display:flex; gap:8px; align-items:center; margin:8px 0; }
.row.small { margin-top:6px; }
footer { margin-top:20px; text-align:center; color:#666; }
*/

/* --- README + Backend samples (paste to project root README.md) ---
# Cyberbully Detector — Frontend README

This React app is a prototype frontend for a cyberbullying detection system. It expects a backend with two main capabilities:

A) Score text for bullying (ML model service behind an API)
B) Fetch posts from Twitter, Reddit, and YouTube (normalized JSON)

## Backend API contract (recommended)

### POST /api/score
- Accepts: { "text": "..." } or { "texts": ["a","b"] }
- Returns: if single input -> { "label": "bullying"|"non-bullying", "scores": { "nonbullying":0.12, "bullying":0.88 } }
           if batch -> { "results": [ { label, scores }, ... ] }

### GET /api/fetch?source=twitter|reddit|youtube&query=...&limit=10
- Returns: { "items": [ { "id":"...", "text":"...", "meta": { author, date, url, subreddit, title, ... } } ] }

## Sample Express gateway (short)

```js
// api/src/routes/messages.js (express)
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/score', async (req, res) => {
  const { text, texts } = req.body;
  // forward to ML microservice
  const payload = text ? { text } : { texts };
  const ml = await axios.post(process.env.ML_URL + '/predict', payload);
  // normalize and return
  if (texts) return res.json({ results: ml.data.results });
  return res.json(ml.data);
});

module.exports = router;
```

## Sample ML microservice (Flask) endpoint

```py
# app.py
from flask import Flask, request, jsonify
from model import ToxicClassifier
app = Flask(__name__)
model = ToxicClassifier('saved_models/toxicbert')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if 'texts' in data:
        results = model.predict_batch(data['texts'])
        return jsonify({'results': results})
    if 'text' in data:
        res = model.predict([data['text']])
        return jsonify(res[0])
    return jsonify({'error':'no input'}), 400
```

## Social fetchers (notes)
- Twitter: use Twitter API v2 (Bearer token). Endpoint: `https://api.twitter.com/2/tweets/search/recent?query=...` and then normalize `text`, `author_id`, `created_at`.
- Reddit: use `snoowrap` (JS) or `PRAW` (Python) or Reddit HTTP API for searching; normalize `selftext` or `title`.
- YouTube: use YouTube Data API v3 (search -> get video ids -> fetch snippet + comments if needed).

## Running locally (quickstart)
1. Start backend(s): ML service + API gateway. See `infra/docker-compose.yml` sample below.
2. In frontend directory:
   ```bash
   npm install
   npm start
   ```
3. Open http://localhost:3000

## Sample docker-compose (skeleton)
```yaml
version: '3.8'
services:
  mongo:
    image: mongo:6
    volumes: [ 'mongo-data:/data/db' ]
  ml-service:
    build: ./ml-service
    ports: [ '5000:5000' ]
  api:
    build: ./api
    ports: [ '8000:8000' ]
    environment:
      - ML_URL=http://ml-service:5000
  frontend:
    build: ./frontend
    ports: [ '3000:3000' ]
volumes:
  mongo-data: {}
```

## Security & production notes
- Never commit API keys. Use env vars / secret manager.
- Rate-limit social API calls and cache results.
- If exposing model over the internet, add auth and request quotas.
- GDPR / privacy: store minimal PII and obey platform terms of use.

*/
