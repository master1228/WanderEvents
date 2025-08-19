import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from 'react-router-dom';

const SEOHead = ({ 
  pageType = 'website', 
  pagePath = '', 
  customTitle = null,
  customDescription = null,
  structuredData = null 
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

  useEffect(() => {
    // Получаем переводы для SEO
    const seoTitle = customTitle || t('seo.title', { defaultValue: 'WanderEvents — Book concerts & festivals' });
    const seoDescription = customDescription || t('seo.description', { defaultValue: 'Book tickets for concerts and festivals across Europe' });
    const seoKeywords = t('seo.keywords', { defaultValue: 'wanderevents, concerts, festivals, tickets' });

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

    // Основные мета-теги
    const metaTags = [
      { name: 'description', content: seoDescription },
      { name: 'keywords', content: seoKeywords },
      { name: 'robots', content: 'index,follow' },
      { name: 'language', content: locale },
      { name: 'author', content: 'WanderEvents Team' },
      { name: 'distribution', content: 'global' },
      
      // Open Graph
      { property: 'og:site_name', content: 'WanderEvents' },
      { property: 'og:locale', content: locale === 'ru' ? 'ru_RU' : locale === 'pl' ? 'pl_PL' : 'en_US' },
      { property: 'og:title', content: t('seo.og_title', { defaultValue: seoTitle }) },
      { property: 'og:description', content: seoDescription },
      { property: 'og:url', content: getPageUrl() },
      { property: 'og:type', content: pageType },
      { property: 'og:image', content: `${DOMAIN}/assets/icons/favicon-96x96.png` },
      { property: 'og:image:width', content: '96' },
      { property: 'og:image:height', content: '96' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: t('seo.twitter_title', { defaultValue: seoTitle }) },
      { name: 'twitter:description', content: seoDescription },
      { name: 'twitter:image', content: `${DOMAIN}/assets/icons/favicon-96x96.png` }
    ];

    // Добавляем мета-теги
    metaTags.forEach(({ name, property, content }) => {
      const meta = document.createElement('meta');
      if (name) meta.name = name;
      if (property) meta.setAttribute('property', property);
      meta.content = content;
      meta.setAttribute('data-seo', 'true');
      document.head.appendChild(meta);
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

    // Добавляем Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WanderEvents",
      "alternateName": ["Вандеревентс", "Wanderevents", "Wander Events", "Вандер евентс", "вандер ивентс"],
      "url": DOMAIN,
      "logo": `${DOMAIN}/assets/icons/favicon-96x96.png`,
      "sameAs": [
        "https://www.instagram.com/wanderevents",
        "https://www.facebook.com/wanderevents", 
        "https://www.linkedin.com/company/wanderevents",
        "https://t.me/wanderevents"
      ]
    };

    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.setAttribute('data-seo', 'true');
    orgScript.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(orgScript);

    // Добавляем WebSite Schema
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": DOMAIN,
      "name": "WanderEvents",
      "alternateName": ["Вандеревентс", "Wanderevents"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${DOMAIN}/search?q={query}`,
        "query-input": "required name=query"
      }
    };

    const wsScript = document.createElement('script');
    wsScript.type = 'application/ld+json';  
    wsScript.setAttribute('data-seo', 'true');
    wsScript.textContent = JSON.stringify(websiteSchema);
    document.head.appendChild(wsScript);

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
  }, [locale, t, pagePath, location.pathname, customTitle, customDescription, structuredData, pageType, DOMAIN, getPageUrl, getDefaultUrl, languages]);

  return null; // Компонент не рендерит ничего видимого
};

export default SEOHead;
