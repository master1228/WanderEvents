// src/utils/api.js
// Helper functions to interact with the Strapi API (Render cloud only)

// Try to load local dev override first
let localConfig;
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  localConfig = require('../strapi.local').default;
} catch (_) {
  localConfig = null;
}

const API_URL = localConfig?.API_URL || process.env.REACT_APP_STRAPI_URL;
const API_TOKEN = localConfig?.API_TOKEN || process.env.REACT_APP_STRAPI_TOKEN;
const LOCAL_API_URL = 'http://localhost:1337/api';
const LOCAL_API_TOKEN = localConfig?.LOCAL_API_TOKEN || process.env.REACT_APP_STRAPI_LOCAL_TOKEN || '';

// DEBUG: log which API token is used and source
console.log('Using Strapi config:', {
  source: localConfig ? 'strapi.local.js' : '.env',
  API_URL,
  API_TOKEN_FIRST_CHARS: API_TOKEN?.substring(0, 10),
});

if (!API_URL) {
  console.error('Missing environment variable REACT_APP_STRAPI_URL');
}
if (!API_TOKEN) {
  console.error('Missing environment variable REACT_APP_STRAPI_TOKEN');
}

export async function strapiFetch(endpoint, { method = 'GET', body } = {}) {
  const servers = [
    { url: LOCAL_API_URL, token: LOCAL_API_TOKEN },
    { url: API_URL, token: API_TOKEN },
  ];

  const optionsBase = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) optionsBase.body = JSON.stringify(body);

  let lastError;
  for (const { url, token } of servers) {
    try {
      const opts = { ...optionsBase };
      if (token) opts.headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${url}${endpoint}`, opts);
      if (!res.ok) {
        // For 401/404 etc. treat as error, but try next server
        lastError = new Error(`Strapi request failed: ${res.status}`);
        continue;
      }
      return res.json();
    } catch (err) {
      lastError = err;
      // Network error etc. -> try next server
    }
  }
  throw lastError || new Error('All Strapi servers failed');
}

// Fetch events with all relations populated (image, tickets, etc.)
export async function fetchEvents() {
  return strapiFetch('/events?populate=*');
}

// Additional helpers can be added here (e.g., fetchSingleEvent, createTicket, etc.)

export function getStrapiBaseUrl() {
  return API_URL.replace(/\/api\/?$/, '');
}
