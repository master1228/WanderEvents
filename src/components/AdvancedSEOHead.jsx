import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

const AdvancedSEOHead = ({ 
  pageType = 'website', 
  pagePath = '', 
  customTitle = null,
  customDescription = null,
  structuredData = null,
  events = [],
  breadcrumbs = [],
  images = [],
  videos = []
}) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const location = useLocation();

  // Определяем домен (в продакшене нужно заменить на реальный)
  const DOMAIN = process.env.NODE_ENV === 'production' ? 'https://wanderevents.pl' : 'http://localhost:3000';
  
  // Поддерживаемые языки (мемоизируем для избежания пересозданий)
  const languages = useMemo(() => [
    { code: 'ru', hreflang: 'ru' },
    { code: 'en', hreflang: 'en' },
    { code: 'pl', hreflang: 'pl' }
  ], []);

  // Генерируем URL для текущей страницы
  const getPageUrl = useCallback((lang = null) => {
    const currentLang = lang || locale;
    const basePath = pagePath || location.pathname.replace(/^\/?(ru|en|pl)\/?/, '');
    
    if (currentLang === 'ru') {
      return `${DOMAIN}/${basePath || ''}`.replace(/\/$/, '') || DOMAIN;
    }
    
    return `${DOMAIN}/${currentLang}/${basePath || ''}`.replace(/\/$/, '') || `${DOMAIN}/${currentLang}`;
  }, [DOMAIN, locale, pagePath, location.pathname]);

  // x-default всегда указывает на русскую версию (домашнюю)
  const getDefaultUrl = useCallback(() => {
    const basePath = pagePath || location.pathname.replace(/^\/?(ru|en|pl)\/?/, '');
    return `${DOMAIN}/${basePath || ''}`.replace(/\/$/, '') || DOMAIN;
  }, [DOMAIN, pagePath, location.pathname]);

  // Определяем тип страницы для правильных SEO переводов
  const currentPath = pagePath || location.pathname;
  const isMerchPage = currentPath.includes('/merch');

  useEffect(() => {
    
    // Получаем переводы для SEO в зависимости от типа страницы
    const seoTitle = customTitle || (isMerchPage 
      ? t('seo.merch.title', { defaultValue: 'WanderEvents Merch — Official Merchandise' })
      : t('seo.title', { defaultValue: 'WanderEvents — Book concerts & festivals' }));
    
    const seoDescription = customDescription || (isMerchPage 
      ? t('seo.merch.description', { defaultValue: 'Shop official WanderEvents merchandise and accessories' })
      : t('seo.description', { defaultValue: 'Book tickets for concerts and festivals across Europe' }));
    
    const seoKeywords = isMerchPage 
      ? t('seo.merch.keywords', { defaultValue: 'wanderevents merch, official merchandise, t-shirts, accessories' })
      : t('seo.keywords', { defaultValue: 'wanderevents, concerts, festivals, tickets' });

    // Устанавливаем базовые мета-теги
    document.title = seoTitle;
    document.documentElement.lang = locale;

    // Удаляем существующие SEO теги
    const existingSeoTags = document.head.querySelectorAll('[data-seo]');
    existingSeoTags.forEach(tag => tag.remove());

    // Canonical URL
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = getPageUrl();
    canonical.setAttribute('data-seo', 'true');
    document.head.appendChild(canonical);

    // Основные мета-теги с дополнительными для мобильных и международных пользователей
    const metaTags = [
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: seoKeywords },
      { name: 'robots', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
      { name: 'language', content: locale },
      { name: 'author', content: 'WanderEvents Team' },
      { name: 'distribution', content: 'global' },
      { name: 'revisit-after', content: '1 days' },
      { name: 'rating', content: 'general' },
      { name: 'coverage', content: 'worldwide' },
      { name: 'target', content: 'all' },
      
      // Мобильная оптимизация  
      { name: 'viewport', content: 'width=device-width,initial-scale=1,viewport-fit=cover' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'WanderEvents' },
      { name: 'application-name', content: 'WanderEvents' },
      { name: 'msapplication-TileColor', content: '#ff6b35' },
      { name: 'theme-color', content: '#ff6b35' },
      
      // Международная аудитория
      { name: 'geo.region', content: 'EU' },
      { name: 'geo.placename', content: 'Europe' },
      { name: 'ICBM', content: '52.2297,21.0122' }, // Warsaw coordinates
      
      // Open Graph - расширенный набор
      { property: 'og:site_name', content: 'WanderEvents' },
      { property: 'og:locale', content: locale === 'ru' ? 'ru_RU' : locale === 'pl' ? 'pl_PL' : 'en_US' },
      { property: 'og:title', content: isMerchPage 
        ? t('seo.merch.og_title', { defaultValue: seoTitle })
        : t('seo.og_title', { defaultValue: seoTitle }) },
      { property: 'og:description', content: seoDescription },
      { property: 'og:url', content: getPageUrl() },
      { property: 'og:type', content: pageType },
      { property: 'og:image', content: `${DOMAIN}/assets/icons/favicon-96x96.png` },
      { property: 'og:image:secure_url', content: `${DOMAIN}/assets/icons/favicon-96x96.png` },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:image:width', content: '96' },
      { property: 'og:image:height', content: '96' },
      { property: 'og:image:alt', content: 'WanderEvents Logo - Concert & Festival Tickets' },
      { property: 'og:updated_time', content: new Date().toISOString() },

      // Twitter Card - расширенный
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@wanderevents' },
      { name: 'twitter:creator', content: '@wanderevents' },
      { name: 'twitter:title', content: isMerchPage 
        ? t('seo.merch.twitter_title', { defaultValue: seoTitle })
        : t('seo.twitter_title', { defaultValue: seoTitle }) },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: `${DOMAIN}/assets/icons/favicon-96x96.png` },
      { name: 'twitter:image:alt', content: 'WanderEvents Logo - Concert & Festival Tickets' },
      { name: 'twitter:domain', content: 'wanderevents.pl' },

      // Дополнительные поисковые теги
      { name: 'googlebot', content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' },
      { name: 'bingbot', content: 'index,follow' },
      { name: 'yandex', content: 'index,follow' },
      
      // Rich snippets hints
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'msvalidate.01', content: '' }, // Microsoft Bing verification
      { name: 'yandex-verification', content: '' }, // Yandex verification
      { name: 'p:domain_verify', content: '' }, // Pinterest verification
    ];

    // Добавляем мета-теги
    metaTags.forEach(({ name, property, content }) => {
      if (!content) return; // Пропускаем пустые теги
      const meta = document.createElement('meta');
      if (name) meta.name = name;
      if (property) meta.setAttribute('property', property);
      meta.content = content;
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
    });

    // Preload критических ресурсов
    const preloadResources = [
      { href: '/assets/icons/favicon-96x96.png', as: 'image', type: 'image/png' },
      { href: '/assets/fonts/roboto-mono-v13-latin-regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
    ];

    preloadResources.forEach(({ href, as, type, crossorigin }) => {
      if (document.querySelector(`link[href="${href}"]`)) return; // Избегаем дублирования
      const preload = document.createElement('link');
      preload.rel = 'preload';
      preload.href = href;
      preload.as = as;
      if (type) preload.type = type;
      if (crossorigin) preload.crossOrigin = crossorigin;
      preload.setAttribute('data-seo', 'true');
      document.head.appendChild(preload);
    });

    // Hreflang теги
    languages.forEach(lang => {
      const hreflang = document.createElement('link');
      hreflang.rel = 'alternate';
      hreflang.hreflang = lang.hreflang;
      hreflang.href = getPageUrl(lang.code);
      hreflang.setAttribute('data-seo', 'true');
      document.head.appendChild(hreflang);
    });

    // x-default hreflang (указывает на русскую версию)
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = getDefaultUrl();
    xDefault.setAttribute('data-seo', 'true');
    document.head.appendChild(xDefault);

    // Структурированные данные JSON-LD
    const existingStructuredData = document.head.querySelectorAll('script[type="application/ld+json"][data-seo]');
    existingStructuredData.forEach(script => script.remove());

    // 1. Organization Schema (расширенный)
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WanderEvents",
      "alternateName": ["Вандеревентс", "Wanderevents", "Wander Events", "Вандер евентс", "вандер ивентс"],
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/assets/icons/favicon-96x96.png`,
        "width": "96",
        "height": "96",
        "caption": "WanderEvents Logo"
      },
      "image": `${DOMAIN}/assets/icons/favicon-96x96.png`,
      "description": seoDescription,
      "foundingDate": "2024",
      "founder": {
        "@type": "Organization",
        "name": "WanderEvents Team"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": ["Russian", "English", "Polish"]
      },
      "areaServed": {
        "@type": "Place",
        "name": "Europe"
      },
      "serviceType": "Event Ticketing",
      "sameAs": [
        "https://www.instagram.com/wanderevents",
        "https://www.facebook.com/wanderevents", 
        "https://www.linkedin.com/company/wanderevents",
        "https://t.me/wanderevents",
        "https://twitter.com/wanderevents"
      ]
    };

    // 2. LocalBusiness Schema
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "WanderEvents",
      "alternateName": ["Вандеревентс", "Wanderevents"],
      "url": DOMAIN,
      "logo": `${DOMAIN}/assets/icons/favicon-96x96.png`,
      "image": `${DOMAIN}/assets/icons/favicon-96x96.png`,
      "description": seoDescription,
      "priceRange": "€€",
      "currenciesAccepted": "EUR, USD, PLN, RUB",
      "paymentAccepted": "Credit Card, PayPal, Bank Transfer",
      "openingHours": "Mo-Su 00:00-23:59",
      "telephone": "+48-123-456-789",
      "areaServed": ["Europe", "Poland", "Germany", "Russia", "United Kingdom"],
      "serviceArea": {
        "@type": "Place",
        "name": "Europe"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Concert and Festival Tickets",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Concert Tickets",
              "description": "Premium concert tickets across Europe"
            }
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Festival Tickets",
              "description": "Music festival passes and tickets"
            }
          }
        ]
      }
    };

    // 3. WebSite Schema (расширенный)
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": DOMAIN,
      "name": "WanderEvents",
      "alternateName": ["Вандеревентс", "Wanderevents"],
      "description": seoDescription,
      "inLanguage": [
        { "@type": "Language", "name": "Russian", "alternateName": "ru" },
        { "@type": "Language", "name": "English", "alternateName": "en" },
        { "@type": "Language", "name": "Polish", "alternateName": "pl" }
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Music Lovers",
        "geographicArea": {
          "@type": "Place",
          "name": "Europe"
        }
      },
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": `${DOMAIN}/search?q={query}`,
          "query-input": "required name=query"
        },
        {
          "@type": "ReadAction",
          "target": `${DOMAIN}/events`
        }
      ],
      "mainEntity": {
        "@type": "ItemList",
        "name": "Concert and Festival Events",
        "description": "List of upcoming concerts and festivals"
      }
    };

    // 4. BreadcrumbList Schema (если есть хлебные крошки)
    if (breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.url
        }))
      };
      
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.setAttribute('data-seo', 'true');
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
      document.head.appendChild(breadcrumbScript);
    }

    // 5. Event Schema для событий (если переданы)
    if (events.length > 0) {
      events.forEach(event => {
        const eventSchema = {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": event.name,
          "description": event.description || seoDescription,
          "startDate": event.startDate,
          "endDate": event.endDate,
          "location": {
            "@type": "Place",
            "name": event.location?.name || "Europe",
            "address": event.location?.address || "Europe"
          },
          "organizer": {
            "@type": "Organization",
            "name": "WanderEvents",
            "url": DOMAIN
          },
          "offers": {
            "@type": "Offer",
            "url": `${DOMAIN}/events/${event.id}`,
            "price": event.price || "0",
            "priceCurrency": "EUR",
            "availability": "https://schema.org/InStock",
            "validFrom": new Date().toISOString()
          },
          "image": event.image || `${DOMAIN}/assets/icons/favicon-96x96.png`,
          "performer": {
            "@type": "Person",
            "name": event.performer || "Various Artists"
          }
        };

        const eventScript = document.createElement('script');
        eventScript.type = 'application/ld+json';
        eventScript.setAttribute('data-seo', 'true');
        eventScript.textContent = JSON.stringify(eventSchema);
        document.head.appendChild(eventScript);
      });
    }

    // Добавляем основные схемы
    [organizationSchema, localBusinessSchema, websiteSchema].forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    // Кастомные структурированные данные (если переданы)
    if (structuredData) {
      const customScript = document.createElement('script');
      customScript.type = 'application/ld+json';
      customScript.setAttribute('data-seo', 'true');
      customScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(customScript);
    }

    // Очистка при размонтировании компонента
    return () => {
      // Теги будут очищены при следующем рендере
    };
  }, [locale, t, pagePath, location.pathname, customTitle, customDescription, structuredData, pageType, DOMAIN, getPageUrl, getDefaultUrl, languages, events, breadcrumbs, isMerchPage]);

  return null; // Компонент не рендерит ничего видимого
};

export default AdvancedSEOHead;
