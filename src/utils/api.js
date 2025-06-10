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

export async function strapiFetch(endpoint, { method = 'GET', body } = {}, locale = 'ru') {
  const separator = endpoint.includes('?') ? '&' : '?';
  const localizedEndpoint = `${endpoint}${separator}locale=${locale}`;

  const servers = [
    { url: LOCAL_API_URL, token: LOCAL_API_TOKEN },
    { url: API_URL, token: API_TOKEN },
  ];

  const optionsBase = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) optionsBase.body = JSON.stringify(body);

  let lastError;
  for (const { url, token } of servers) {
    if (!url) continue; // Skip if a URL isn't defined
    try {
      const opts = { ...optionsBase, headers: { ...optionsBase.headers } }; // Clone headers to avoid mutation
      if (token) {
        opts.headers.Authorization = `Bearer ${token}`;
      }
      const res = await fetch(`${url}${localizedEndpoint}`, opts);
      if (!res.ok) {
        lastError = new Error(`Strapi request to ${url} failed: ${res.status}`);
        continue;
      }
      return res.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All Strapi servers failed');
}

// Update fetch functions to accept and pass locale
export const fetchEvents = (locale) => strapiFetch('/events?populate=*', {}, locale);
export const fetchFooterLinks = (locale) => strapiFetch('/ftrs?populate=*', {}, locale);
export const fetchSocialLinks = (locale) => strapiFetch('/scls?populate=*', {}, locale);
export const fetchVideo = (locale) => strapiFetch('/videos?populate=*', {}, locale);
export const fetchAbout = (locale) => strapiFetch('/abous?populate=*', {}, locale);
export const fetchAgreement = (locale) => strapiFetch('/agrs?populate=*', {}, locale);

// Additional helpers can be added here (e.g., fetchSingleEvent, createTicket, etc.)

export function getStrapiBaseUrl() {
  return API_URL.replace(/\/api\/?$/, '');
}
