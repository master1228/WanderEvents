# WanderEvents

## О проекте

WanderEvents - это веб-приложение для просмотра и покупки билетов на мероприятия. Проект создан с использованием React и SCSS, вдохновлен дизайном сайта ogbuda.com.

## Особенности проекта

- Темная тема с использованием черных, белых и красных цветов
- Минималистичный и современный дизайн
- Адаптивный интерфейс для различных устройств
- Простая навигация
- Функция выбора количества билетов

## Структура проекта

```
src/
├── assets/            # Медиа-ресурсы
│   ├── icons/         # Иконки и мелкие графические элементы
│   ├── images/        # Изображения, баннеры, фотографии
│   └── logos/         # Логотипы сайта
├── components/        # Компоненты приложения
│   ├── EventCard.jsx  # Карточка мероприятия
│   └── Header.jsx     # Шапка сайта
├── pages/             # Страницы приложения
│   └── HomePage.jsx   # Главная страница
├── styles/            # SCSS стили
│   ├── App.scss       # Глобальные стили
│   ├── EventCard.scss # Стили карточки мероприятия
│   ├── Header.scss    # Стили шапки сайта
│   └── HomePage.scss  # Стили главной страницы
└── App.js             # Основной компонент приложения
```

## Использование ресурсов

Для использования изображений и других медиа-ресурсов в компонентах:

```jsx
// Импорт изображения
import logo from '../assets/logos/logo.png';
import eventImage from '../assets/images/event.jpg';
import ticketIcon from '../assets/icons/ticket.svg';

// Использование в JSX
<img src={logo} alt="Logo" />
<div style={{ backgroundImage: `url(${eventImage})` }}></div>
```

## Установка и запуск

1. Клонировать репозиторий
2. Установить зависимости: `npm install`
3. Запустить приложение: `npm start`
4. Открыть [http://localhost:3000](http://localhost:3000) в браузере

## Доступные скрипты

### `npm start`

Запускает приложение в режиме разработки.
Откройте [http://localhost:3000](http://localhost:3000) для просмотра в браузере.

### `npm run build`

Создает оптимизированную версию приложения для продакшена в папке `build`.

## Системные требования

- Node.js **v18** или выше
- npm **v9** или выше (или pnpm/yarn на ваш выбор)

## Переменные окружения

Фронтенд использует переменные, задаваемые через `.env*` файлы в корне:

| Переменная                | Назначение                                         | Пример                             |
|---------------------------|----------------------------------------------------|------------------------------------|
| `REACT_APP_API_URL`       | Базовый URL Strapi CMS                             | `https://admin.wanderevents.pl/api` |
| `REACT_APP_API_TOKEN`     | Персональный токен доступа (Strapi → Settings → API Tokens) | `d3cb5...`                       |
| `REACT_APP_STRAPI_CDN`    | CDN-домен для картинок, если используете Cloudflare | `https://cdn.wanderevents.pl`      |

Создайте `.env.development` для локальной разработки и `.env.production` для деплоя.

## Backend (Strapi) – структура контента

### Content-Type `Event`
| Поле     | Тип        |
|----------|-----------|
| name     | Text      |
| description | Rich Text |
| date     | Text (short) |
| time     | Text (short) |
| city     | Text      |
| venue    | Text      |
| image    | Media     |
| tickets  | Relation many → `Ticket` |

### Content-Type `Ticket`
| Поле        | Тип     |
|-------------|---------|
| type        | Text    |
| description | Text    |
| price       | Number  |

### Кэширование Strapi
1. Установите плагин: `npm install strapi-plugin-rest-cache redis@^4`
2. `config/plugins.js`:
```js
module.exports = {
  "rest-cache": {
    enabled: true,
    provider: {
      name: "redis",
      options: {
        max: 32767,
        connection: {
          host: "127.0.0.1",
          port: 6379,
        },
      },
    },
  },
};
```
3. Перезапустите Strapi.

## SEO

1. **Мета-теги** уже прописаны в `public/index.html` (`title`, `description`, OpenGraph, Twitter Card).
2. **robots.txt** разрешает обход и указывает карту сайта.
3. **sitemap.xml** генерируется вручную и лежит в `public/sitemap.xml`. Добавьте при необходимости внутренние URL.
4. Добавьте домен в **Google Search Console** и отправьте `sitemap.xml`.

## Платёжные провайдеры

| Провайдер       | Тип подключения                | Нужен бизнес-аккаунт | SDK/документация |
|-----------------|--------------------------------|----------------------|------------------|
| Stripe Checkout | Хост-страница, вебхуки         | Нет (Sole Proprietor)| https://stripe.com/docs/payments/checkout |
| PayPal Buttons  | JS SDK, клиентский рендер      | Нет                 | https://developer.paypal.com/docs/checkout/ |
| BTCPay Server   | Self-hosted крипто-платежи     | Нет                 | https://docs.btcpayserver.org/ |

После успешного платежа вызывайте эндпоинт Strapi `/orders` (создать Content-Type `Order`) через webhook или фронтенд callback.

## Сборка и деплой

```bash
# продакшн
npm run build
# результат в папке build/ загрузите на Netlify, Vercel или статический хостинг
```

Для авто-деплоя на Netlify положите `netlify.toml`:
```toml
[build]
  publish = "build"
  command = "npm run build"
```

## Тестирование

- Jest + React Testing Library (`npm test`).
- ESLint конфиг включён через `react-app`.

## Troubleshooting

| Проблема                               | Решение |
|----------------------------------------|---------|
| Белый экран после деплоя               | Проверьте правильность `REACT_APP_API_URL` в build.
| Медленная загрузка списка событий      | Убедитесь, что Strapi кэш включён и ответы не содержат лишних полей.

## Лицензия

MIT © WanderEvents Team
