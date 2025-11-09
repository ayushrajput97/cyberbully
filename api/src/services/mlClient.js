const axios = require('axios');
const ML_URL = process.env.ML_URL || 'http://ml-service:5000';

async function predictText(text) {
  const res = await axios.post(`${ML_URL}/predict`, { text });
  return res.data;
}
module.exports = { predictText };
