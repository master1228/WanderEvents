// src/utils/api.js
// Helper functions to interact with the Strapi API (Render cloud only)

// Try to load local dev override first (only in development)
/* eslint-disable global-require */
let localConfig = null;
if (process.env.NODE_ENV !== 'production') {
  try {
    // Use dynamic eval so webpack doesn't bundle the file in production
    // eslint-disable-next-line no-eval
    localConfig = eval("require('../strapi.local.example')").default;
  } catch {
    // File absent – fall back to .env
    localConfig = null;
  }
}
/* eslint-enable global-require */

const API_URL = localConfig?.API_URL || process.env.REACT_APP_STRAPI_URL;
// Hard-coded production token to avoid relying on build-time env
const HARDCODE_TOKEN = '106b6ef7b08988d2a974e89aacc30e525548dc8ed387231988925f23fbd1e5ea5ac2a21bc83bb6c311badb9532cfc5d67796d5b76309ad1ad743a0ca21560a2b85ecde310aea8625aeb5c962dffd3c68edb2c7248c97d9c3bcf038d8f950b1c3f06318b0f22d4ef00f60d04f0b12d95b0c857c03d72d3e0efa004132093686c5';
let API_TOKEN = (localConfig?.API_TOKEN || HARDCODE_TOKEN).trim();
const LOCAL_API_URL = 'http://localhost:1337/api';
const LOCAL_API_TOKEN = localConfig?.LOCAL_API_TOKEN || process.env.REACT_APP_STRAPI_LOCAL_TOKEN || '';

// DEBUG: log which API token is used and source
console.log('Using Strapi config:', {
  source: localConfig ? 'strapi.local.js' : '.env',
  API_URL,
  API_TOKEN_PRESENT: Boolean(API_TOKEN),
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
      const trimmedToken = token?.trim();
      if (trimmedToken) {
        opts.headers.Authorization = `Bearer ${trimmedToken}`;
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
