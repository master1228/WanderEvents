// src/utils/api.js
// Helper functions to interact with the Strapi API

// Prefer local Strapi for development convenience.
const LOCAL_API_URL = 'http://localhost:1337/api';
const REMOTE_API_URL = process.env.REACT_APP_STRAPI_URL || 'https://wandereventscms.onrender.com/api';

// Optional separate tokens for local / remote (remote token often required).
const LOCAL_API_TOKEN = process.env.REACT_APP_STRAPI_LOCAL_TOKEN || '';
const REMOTE_API_TOKEN = process.env.REACT_APP_STRAPI_TOKEN || '';

console.log('Strapi API configuration:', { LOCAL_API_URL, REMOTE_API_URL });

let activeBaseUrl = REMOTE_API_URL; // always use remote base in production

async function attemptRequest(baseUrl, token, endpoint, method) {
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : undefined
    }
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Strapi request failed: ${res.status} ${msg}`);
  }
  if (!activeBaseUrl) {
    activeBaseUrl = baseUrl; // remember first successful base
  }
  return res.json();
}

// In production we hit only the remote Strapi with token
export async function strapiFetch(endpoint, { method = 'GET' } = {}) {
  return attemptRequest(REMOTE_API_URL, REMOTE_API_TOKEN, endpoint, method);
}

// Fetch events with all relations populated (image, tickets, etc.)
export async function fetchEvents() {
  const query = '/events?populate=*';
  return strapiFetch(query);
}

// Additional helpers can be added later (e.g., fetchSingleEvent, purchaseTicket, etc.)

export function getStrapiBaseUrl() {
  // always remote, strip trailing /api
  return REMOTE_API_URL.replace(/\/api$/, '');
}
