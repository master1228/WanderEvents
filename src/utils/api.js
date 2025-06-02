// src/utils/api.js
// Helper functions to interact with the Strapi API

// In production we want to hit the deployed Strapi instance by default.
// Allow override via REACT_APP_STRAPI_URL for flexibility.
const API_URL = 'https://wandereventscms.onrender.com/api';
const API_TOKEN = '960db0a8a2c9edeb53b4cb389d7b20c6bfab05fc68fcf3f92ea9e092e712eab63132330403dc6e38f804293942d235bebfa903160c45990e083ca4ee27ba10716074618d2feae5b64f2312b8d2481fb54cfb8f82782a220d7f693356dfda01ff1e17d4b630c7f4ebf143ce17ff56746418f482dfcff3ef52a00a4fc8bc88d53a';

console.log('Strapi API URL being used:', API_URL);
console.log('Strapi API Token being used:', API_TOKEN);

async function strapiFetch(endpoint, { method = 'GET' } = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_TOKEN ? `Bearer ${API_TOKEN}` : undefined
    }
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Strapi request failed: ${res.status} ${msg}`);
  }

  return res.json();
}

// Fetch events with all relations populated (image, tickets, etc.)
export async function fetchEvents() {
  const query = '/events?populate=*';
  return strapiFetch(query);
}

// Additional helpers can be added later (e.g., fetchSingleEvent, purchaseTicket, etc.)
