// src/utils/api.js
// Helper functions to interact with the Strapi API (Render cloud only)

import tokenManager from './tokenManager';

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

// --- Server Configuration ---
const REMOTE_API_URL = 'https://wandereventscms.onrender.com/api';
const LOCAL_API_URL = 'http://localhost:1337/api';
const LOCAL_API_TOKEN = localConfig?.LOCAL_API_TOKEN || process.env.REACT_APP_STRAPI_LOCAL_TOKEN || '';

// DEBUG: log API configuration
console.log('Strapi API Configuration:', {
  REMOTE_URL: REMOTE_API_URL,
  LOCAL_URL: LOCAL_API_URL,
  LOCAL_TOKEN_PRESENT: Boolean(LOCAL_API_TOKEN),
  TOKEN_MANAGER: 'Enabled (fetches from server)',
});

export async function strapiFetch(endpoint, { method = 'GET', body } = {}, locale = 'ru') {
  const separator = endpoint.includes('?') ? '&' : '?';
  const localizedEndpoint = `${endpoint}${separator}locale=${locale}`;

  // Получаем актуальный токен с сервера
  const remoteToken = await tokenManager.fetchCurrentToken();

  const servers = [
    { url: REMOTE_API_URL, token: remoteToken },       // Primary: remote server (dynamic token)
    { url: LOCAL_API_URL, token: LOCAL_API_TOKEN },    // Fallback: local dev Strapi
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
  return REMOTE_API_URL.replace(/\/api\/?$/, '');
}

// Экспортируем tokenManager для использования в админ-панели
export { tokenManager };
