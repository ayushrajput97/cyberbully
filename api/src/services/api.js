// src/services/api.js
export async function scoreText(text) {
  const res = await fetch('/api/messages/score', {
    method:'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ text })
  });
  return res.json();
}
