// src/utils/api.js
// Helper functions to interact with the Strapi API (Render cloud only)

import tokenManager from './tokenManager';

// Try to load local dev override first (only in development)
let localConfig = null;
if (process.env.NODE_ENV !== 'production') {
  try {
    // Only try to load in development
    localConfig = require('../strapi.local.example').default;
  } catch {
    // File absent – fall back to .env
    localConfig = null;
  }
}

// --- Server Configuration ---
const LOCAL_API_URL = 'http://localhost:1337/api';
const LOCAL_API_TOKEN = localConfig?.LOCAL_API_TOKEN || process.env.REACT_APP_STRAPI_LOCAL_TOKEN || '';

// DEBUG: log API configuration
console.log('Strapi API Configuration:', {
  LOCAL_URL: LOCAL_API_URL,
  LOCAL_TOKEN_PRESENT: Boolean(LOCAL_API_TOKEN),
  TOKEN_MANAGER: 'Enabled (fetches from server)',
  DYNAMIC_REMOTE_URL: 'Enabled (from server config)',
});

export async function strapiFetch(endpoint, { method = 'GET', body } = {}, locale = 'ru') {
  const separator = endpoint.includes('?') ? '&' : '?';
  const localizedEndpoint = `${endpoint}${separator}locale=${locale}`;

  // Получаем актуальную конфигурацию (URL и токен) с сервера
  let remoteApiUrl, remoteToken;
  try {
    const config = await tokenManager.fetchCurrentConfig();
    remoteApiUrl = config.apiUrl;
    remoteToken = config.token;
  } catch (error) {
    console.warn('Failed to fetch config from server, using fallback:', error.message);
    remoteApiUrl = 'http://3.67.79.126:1337/api'; // fallback URL
    remoteToken = process.env.REACT_APP_STRAPI_TOKEN || '';
  }

  const servers = [
    { url: remoteApiUrl, token: remoteToken },         // Primary: remote server (dynamic config)
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
// Single Types используют единственное число (без 's' в конце)
export const fetchFooterLinks = (locale) => strapiFetch('/ftr?populate=*', {}, locale);
export const fetchSocialLinks = (locale) => strapiFetch('/scl?populate=*', {}, locale);
export const fetchVideo = (locale) => strapiFetch('/video?populate=*', {}, locale);
export const fetchAbout = (locale) => strapiFetch('/abou?populate=*', {}, locale);
export const fetchAgreement = (locale) => strapiFetch('/agr?populate=*', {}, locale);
// Additional helpers can be added here (e.g., fetchSingleEvent, createTicket, etc.)

export async function getStrapiBaseUrl() {
  try {
    const apiUrl = await tokenManager.fetchCurrentApiUrl();
    return apiUrl.replace(/\/api\/?$/, '');
  } catch (error) {
    console.warn('Failed to get API URL, using fallback:', error.message);
    return 'http://3.67.79.126:1337'; // fallback base URL
  }
}

// Экспортируем tokenManager для использования в админ-панели
export { tokenManager };
