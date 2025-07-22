// Централизованное управление токенами Strapi через JSON файл на сервере
class TokenManager {
  constructor() {
    this.currentToken = null;
    this.fallbackToken = '74193af581cd8b690a89bcb2d23ec6317244249d69232ff0626568f1cce28be6af1849b3ed640a2cff31bcaea7bbd0fa68a2dfa84ed8bdd6a2e774ac311919bf90a7c29db8bece3d8234cc59a5554fca5c5fece724cf45ee73aa4dced888c5decde2f8fff2b3f2cd87d3ed0f51645550f88d1258ea5919e7de182e885fa3a738';
    
    // JSON файл на том же сервере, где размещен сайт
    this.tokenConfigUrl = '/strapi-config.json';
    this.adminPassword = 'wanderadmin2025';
    
    this.lastFetch = 0;
    this.cacheDuration = 1 * 60 * 1000; // 1 минута кеш (быстрое обновление)
  }

  // Получить актуальный токен из JSON файла на сервере
  async fetchCurrentToken() {
    const now = Date.now();
    
    // Если токен свежий, возвращаем кешированный
    if (this.currentToken && (now - this.lastFetch) < this.cacheDuration) {
      return this.currentToken;
    }

    try {
      console.log('🔄 Fetching current Strapi token from server config...');
      
      // Получаем токен из JSON файла на том же сервере
      const response = await fetch(this.tokenConfigUrl, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        },
        timeout: 5000
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token && data.token.trim()) {
          this.currentToken = data.token.trim();
          this.lastFetch = now;
          console.log('✅ Successfully fetched current token from server config');
          return this.currentToken;
        }
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch token from server config:', error.message);
    }

    // Fallback: захардкоженный токен
    console.log('🔄 Using fallback hardcoded token');
    return this.fallbackToken;
  }

  // Обновить токен в JSON файле на сервере (через админ-панель)
  async updateServerToken(newToken, adminPassword) {
    // Простая проверка пароля
    if (adminPassword !== this.adminPassword) {
      return { success: false, error: 'Неверный пароль администратора' };
    }

    try {
      // Подготавливаем новые данные конфигурации
      const configData = {
        token: newToken.trim(),
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin-panel'
      };
      
      // Обновляем токен в памяти для немедленного применения
      this.currentToken = newToken.trim();
      this.lastFetch = Date.now();
      
      console.log('✅ Token prepared for server update.');
      
      return { 
        success: true,
        message: 'Для применения токена обновите файл /public/strapi-config.json на сервере.'
      };
      
    } catch (error) {
      console.error('❌ Error updating token:', error);
      return { 
        success: false, 
        error: 'Ошибка при обновлении: ' + error.message 
      };
    }
  }

  // Получить инструкцию для ручного обновления файла на сервере
  getUpdateInstructions(newToken) {
    const configData = {
      token: newToken.trim(),
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
        '5. Новый токен применится для всех пользователей в течение 1 минуты'
      ]
    };
  }

  // Сбросить кеш токена
  invalidateCache() {
    this.currentToken = null;
    this.lastFetch = 0;
  }
}

// Экспортируем единственный экземпляр
export const tokenManager = new TokenManager();
export default tokenManager;
