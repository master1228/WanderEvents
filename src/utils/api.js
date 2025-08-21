// src/utils/api.js
// Helper functions to interact with the Strapi API (Render cloud only)

import tokenManager from './tokenManager';

// Функция для получения текущего языка пользователя
const getCurrentLanguage = () => {
  // Пробуем получить язык из localStorage (i18next сохраняет туда)
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && ['ru', 'en', 'pl'].includes(savedLang)) {
    return savedLang;
  }

  // Определяем по языку браузера
  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.toLowerCase().split('-')[0];
  
  const supportedLanguages = ['ru', 'en', 'pl'];
  
  if (supportedLanguages.includes(langCode)) {
    return langCode;
  }
  
  // Fallback на русский
  return 'ru';
};

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

export async function strapiFetch(endpoint, { method = 'GET', body } = {}, locale = getCurrentLanguage()) {
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

// Update fetch functions to accept and pass locale (автоматически используют текущий язык)
export const fetchEvents = (locale = getCurrentLanguage()) => strapiFetch('/events?populate=*', {}, locale);
// Single Types используют единственное число (без 's' в конце)
export const fetchFooterLinks = (locale = getCurrentLanguage()) => strapiFetch('/ftr?populate=*', {}, locale);
export const fetchSocialLinks = (locale = getCurrentLanguage()) => strapiFetch('/scl?populate=*', {}, locale);
export const fetchVideo = (locale = getCurrentLanguage()) => strapiFetch('/video?populate=*', {}, locale);
export const fetchAbout = (locale = getCurrentLanguage()) => strapiFetch('/abou?populate=*', {}, locale);
export const fetchAgreement = (locale = getCurrentLanguage()) => strapiFetch('/agr?populate=*', {}, locale);

// Merch API functions
export const fetchMerchItems = async (locale = getCurrentLanguage(), category = null) => {
  console.log('🎯 fetchMerchItems called with:', { locale, category }); // ЛОГИРУЕМ ВЫЗОВ
  
  try {
    let endpoint = `/merch-items?populate=*`;
    
    // Добавляем фильтр по категории если указан
    if (category && category !== 'all') {
      endpoint += `&filters[category][$eq]=${category}`;
    }
    
    // Убираем фильтр по наличию - показываем все товары, включая распроданные
    
    console.log('📡 Making request to endpoint:', endpoint); // ЛОГИРУЕМ ENDPOINT
    const data = await strapiFetch(endpoint, {}, locale);
    console.log('📥 Raw API response:', data); // ЛОГИРУЕМ ОТВЕТ
    console.log('🔍 Type of data:', typeof data); // ТИП ДАННЫХ
    console.log('🔍 Is data an array?', Array.isArray(data)); // ПРОВЕРКА МАССИВА
    console.log('🔍 data.data exists?', data.data ? 'YES' : 'NO'); // ПРОВЕРКА data.data
    console.log('🔍 data.data type:', typeof data.data); // ТИП data.data
    console.log('🔍 Is data.data an array?', Array.isArray(data.data)); // ПРОВЕРКА МАССИВА data.data
    
    // Преобразуем данные из Strapi v4 формата в нужный формат для фронтенда
    const itemsArray = Array.isArray(data) ? data : data.data || [];
    console.log('🎯 Processing array:', itemsArray); // МАССИВ ДЛЯ ОБРАБОТКИ
    console.log('🎯 Array length:', itemsArray.length); // ДЛИНА МАССИВА
    
    if (Array.isArray(itemsArray) && itemsArray.length > 0) {
      const result = itemsArray.map(item => {
        console.log('🛍️ Processing merch item:', item); // Для отладки
        
        // Адаптивное определение структуры данных
        const hasAttributes = item.attributes !== undefined;
        const itemData = hasAttributes ? item.attributes : item;
        
        // Проверяем мультиязычные или обычные поля
        const name = itemData.name;
        const description = itemData.description;
        const colors = itemData.available_colors;
        
        // Создаем массив изображений, фильтруя пустые значения
        const images = [
          itemData.image_url,
          itemData.image2_url, 
          itemData.image3_url
        ].filter(url => url && url.trim() !== '');

        const processedItem = {
          id: item.id,
          name: typeof name === 'object' ? name : {
            ru: name || '',
            en: name || '',
            pl: name || ''
          },
          description: typeof description === 'object' ? description : {
            ru: description || '',
            en: description || '',
            pl: description || ''
          },
          price: itemData.price || 0,
          currency: itemData.currency || '€',
          image: itemData.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lcmNoIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
          images: images.length > 0 ? images : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lcmNoIEltYWdlPC90ZXh0Pjwvc3ZnPg=='],
          availableColors: typeof colors === 'object' ? colors : {
            ru: colors || '',
            en: colors || '',
            pl: colors || ''
          },
          availableSizes: itemData.available_sizes || 'One Size',
          category: itemData.category || 'accessories',
          inStock: itemData.in_stock !== false,
          rating: 4.8, // Заглушка, так как убрали рейтинги
          reviews: 100, // Заглушка
          isLimited: itemData.is_limited || false,
          purchaseUrl: itemData.purchase_url || '#'
        };
        
        console.log('✅ Processed item:', processedItem); // ЛОГИРУЕМ ОБРАБОТАННЫЙ ТОВАР
        return processedItem;
      });
      
      console.log('🔙 Returning processed array:', result); // ЛОГИРУЕМ ВОЗВРАТ
      return result;
    } else {
      console.log('❌ No items found or array is empty'); // ЛОГИРУЕМ ОТСУТСТВИЕ ДАННЫХ
      console.log('🔙 Returning empty array'); // ЛОГИРУЕМ ВОЗВРАТ
      return [];
    }
  } catch (error) {
    console.error('Error fetching merch items:', error);
    return [];
  }
};

// Получить один товар мерча
export const fetchMerchItem = async (id, locale = getCurrentLanguage()) => {
  try {
    const data = await strapiFetch(`/merch-items/${id}?populate=*`, {}, locale);
    
    if (data) {
      // Адаптивное определение структуры данных
      const hasAttributes = data.attributes !== undefined;
      const itemData = hasAttributes ? data.attributes : data;
      
      const name = itemData.name;
      const description = itemData.description;
      const colors = itemData.available_colors;
      
      // Создаем массив изображений, фильтруя пустые значения
      const images = [
        itemData.image_url,
        itemData.image2_url, 
        itemData.image3_url
      ].filter(url => url && url.trim() !== '');
      
      return {
        id: data.id,
        name: typeof name === 'object' ? name : {
          ru: name || '',
          en: name || '',
          pl: name || ''
        },
        description: typeof description === 'object' ? description : {
          ru: description || '',
          en: description || '',
          pl: description || ''
        },
        price: itemData.price || 0,
        currency: itemData.currency || '€',
        image: itemData.image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lcmNoIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
        images: images.length > 0 ? images : ['data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1lcmNoIEltYWdlPC90ZXh0Pjwvc3ZnPg=='],
        availableColors: typeof colors === 'object' ? colors : {
          ru: colors || '',
          en: colors || '',
          pl: colors || ''
        },
        availableSizes: itemData.available_sizes || 'One Size',
        category: itemData.category || 'accessories',
        inStock: itemData.in_stock !== false,
        rating: 4.8,
        reviews: 100,
        isLimited: itemData.is_limited || false,
        purchaseUrl: itemData.purchase_url || '#'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching merch item:', error);
    return null;
  }
};

// Функция для получения конфигурации таймера из Strapi
export const fetchCountdownConfig = async (locale = getCurrentLanguage()) => {
  const endpoint = '/countdown-config';
  
  try {
    console.log(`Fetching countdown config: ${endpoint}`);
    const data = await strapiFetch(endpoint, {}, locale);
    
    if (!data || !data.data) {
      console.warn('No countdown config found, using defaults');
      return {
        targetDate: null,
        isVisible: false,
        title: null
      };
    }

    const configData = data.data.attributes || data.data;
    
    return {
      targetDate: configData.target_date || null,
      isVisible: configData.is_visible || false,
      title: configData.title || null
    };

  } catch (error) {
    console.error('Error fetching countdown config:', error);
    // Возвращаем дефолтную конфигурацию при ошибке
    return {
      targetDate: null,
      isVisible: false,
      title: null
    };
  }
};

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
