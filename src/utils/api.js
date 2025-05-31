// src/utils/api.js
// Helper functions to interact with the Strapi API

const API_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337/api';
const API_TOKEN = process.env.REACT_APP_STRAPI_TOKEN || '';

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

// Fetch events with related image and tickets populated
export async function fetchEvents() {
  const query = '/events?populate=image&populate=tickets';
  return strapiFetch(query);
}

// Additional helpers can be added later (e.g., fetchSingleEvent, purchaseTicket, etc.)
