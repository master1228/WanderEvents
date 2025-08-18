// Централизованное управление токенами и URL Strapi через JSON файл на сервере
class TokenManager {
  constructor() {
    this.currentToken = null;
    this.currentApiUrl = null;
    this.fallbackToken = '74193af581cd8b690a89bcb2d23ec6317244249d69232ff0626568f1cce28be6af1849b3ed640a2cff31bcaea7bbd0fa68a2dfa84ed8bdd6a2e774ac311919bf90a7c29db8bece3d8234cc59a5554fca5c5fece724cf45ee73aa4dced888c5decde2f8fff2b3f2cd87d3ed0f51645550f88d1258ea5919e7de182e885fa3a738';
    this.fallbackApiUrl = 'http://3.67.79.126:1337/api';
    
    // JSON файл на том же сервере, где размещен сайт
    this.tokenConfigUrl = '/strapi-config.json';
    this.adminPassword = 'wanderadmin2025';
    
    this.lastFetch = 0;
    this.cacheDuration = 1 * 60 * 1000; // 1 минута кеш (быстрое обновление)
  }

  // Получить актуальные настройки (токен и URL) из JSON файла на сервере
  async fetchCurrentConfig() {
    const now = Date.now();
    
    // Если конфигурация свежая, возвращаем кешированную
    if (this.currentToken && this.currentApiUrl && (now - this.lastFetch) < this.cacheDuration) {
      return { token: this.currentToken, apiUrl: this.currentApiUrl };
    }

    try {
      console.log('🔄 Fetching current Strapi config from server...');
      
      // Получаем конфигурацию из JSON файла на том же сервере
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(this.tokenConfigUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.token.trim()) {
          this.currentToken = data.token.trim();
          this.currentApiUrl = data.apiUrl && data.apiUrl.trim() ? data.apiUrl.trim() : this.fallbackApiUrl;
          this.lastFetch = now;
          console.log('✅ Successfully fetched current config from server:', { 
            tokenPresent: Boolean(this.currentToken), 
            apiUrl: this.currentApiUrl 
          });
          return { token: this.currentToken, apiUrl: this.currentApiUrl };
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch config from server:', error.message);
    }

    // Fallback: захардкоженные значения
    console.log('🔄 Using fallback hardcoded config');
    this.currentToken = this.fallbackToken;
    this.currentApiUrl = this.fallbackApiUrl;
    return { token: this.currentToken, apiUrl: this.currentApiUrl };
  }

  // Получить актуальный токен (для обратной совместимости)
  async fetchCurrentToken() {
    const config = await this.fetchCurrentConfig();
    return config.token;
  }

  // Получить актуальный API URL
  async fetchCurrentApiUrl() {
    const config = await this.fetchCurrentConfig();
    return config.apiUrl;
  }

  // Обновить конфигурацию (токен и/или URL) в JSON файле на сервере (через админ-панель)
  async updateServerConfig(newToken, newApiUrl, adminPassword) {
    // Простая проверка пароля
    if (adminPassword !== this.adminPassword) {
      return { success: false, error: 'Неверный пароль администратора' };
    }

    try {
      // Подготавливаем новые данные конфигурации
      const configData = {
        apiUrl: newApiUrl ? newApiUrl.trim() : this.currentApiUrl || this.fallbackApiUrl,
        token: newToken ? newToken.trim() : this.currentToken || this.fallbackToken,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin-panel'
      };
      
      // Обновляем конфигурацию в памяти для немедленного применения
      if (newToken) this.currentToken = newToken.trim();
      if (newApiUrl) this.currentApiUrl = newApiUrl.trim();
      this.lastFetch = Date.now();
      
      console.log('✅ Config prepared for server update.');
      
      return { 
        success: true,
        message: 'Для применения настроек обновите файл /public/strapi-config.json на сервере.',
        configData
      };
      
    } catch (error) {
      console.error('❌ Error updating config:', error);
      return { 
        success: false, 
        error: 'Ошибка при обновлении: ' + error.message 
      };
    }
  }

  // Обновить только токен (для обратной совместимости)
  async updateServerToken(newToken, adminPassword) {
    return this.updateServerConfig(newToken, null, adminPassword);
  }

  // Получить инструкцию для ручного обновления файла на сервере
  getUpdateInstructions(newToken, newApiUrl) {
    const configData = {
      apiUrl: newApiUrl ? newApiUrl.trim() : this.currentApiUrl || this.fallbackApiUrl,
      token: newToken ? newToken.trim() : this.currentToken || this.fallbackToken,
      lastUpdated: new Date().toISOString(),
      updatedBy: 'admin-panel'
    };
    
    return {
      filename: 'strapi-config.json',
      path: '/public/strapi-config.json',
      content: JSON.stringify(configData, null, 2),
      instructions: [
        '1. Скопируйте JSON содержимое ниже',
        '2. Откройте файл /public/strapi-config.json на сервере',
        '3. Замените всё содержимое файла на скопированное',
        '4. Сохраните файл',
        '5. Новые настройки применятся для всех пользователей в течение 1 минуты'
      ]
    };
  }

  // Сбросить кеш конфигурации
  invalidateCache() {
    this.currentToken = null;
    this.currentApiUrl = null;
    this.lastFetch = 0;
  }
}

// Экспортируем единственный экземпляр
export const tokenManager = new TokenManager();
export default tokenManager;
