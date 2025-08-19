import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const InternalLinking = ({ currentPage = 'home', className = '' }) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Определяем базовый префикс для URL
  const getBasePath = () => {
    return locale === 'ru' ? '' : `/${locale}`;
  };

  // Конфигурация внутренних ссылок
  const linkConfig = useMemo(() => ({
    home: {
      title: t('header.events', { defaultValue: 'События' }),
      path: `${getBasePath()}/`,
      description: locale === 'ru' 
        ? 'Главная страница WanderEvents с актуальными концертами и фестивалями'
        : locale === 'en'
        ? 'WanderEvents homepage with current concerts and festivals'
        : 'Strona główna WanderEvents z aktualnymi koncertami i festiwalami',
      keywords: ['концерты', 'фестивали', 'билеты', 'события', 'concerts', 'festivals', 'tickets', 'events', 'bilety']
    },
    about: {
      title: t('about_us_page.title', { defaultValue: 'О нас' }),
      path: `${getBasePath()}/welcome`,
      description: locale === 'ru'
        ? 'Узнайте больше о платформе WanderEvents и нашей миссии'
        : locale === 'en'
        ? 'Learn more about WanderEvents platform and our mission'
        : 'Dowiedz się więcej o platformie WanderEvents i naszej misji',
      keywords: ['о нас', 'команда', 'миссия', 'about us', 'team', 'mission', 'o nas', 'zespół']
    },
    faq: {
      title: t('faq.brand.title', { defaultValue: 'FAQ о бренде' }),
      path: `${getBasePath()}/faq/brand`,
      description: locale === 'ru'
        ? 'Часто задаваемые вопросы о WanderEvents (вандеревентс)'
        : locale === 'en'
        ? 'Frequently asked questions about WanderEvents brand'
        : 'Często zadawane pytania o markę WanderEvents',
      keywords: ['FAQ', 'вопросы', 'помощь', 'support', 'questions', 'pytania', 'pomoc']
    }
  }), [t, locale, getBasePath]);

  // Получаем релевантные ссылки для текущей страницы
  const getRelevantLinks = () => {
    const allPages = Object.keys(linkConfig);
    return allPages.filter(page => page !== currentPage).map(page => linkConfig[page]);
  };

  const relevantLinks = getRelevantLinks();

  if (relevantLinks.length === 0) return null;

  return (
    <nav 
      className={`internal-linking ${className}`}
      aria-labelledby="internal-links-title"
      itemScope
      itemType="https://schema.org/SiteNavigationElement"
    >
      <h3 
        id="internal-links-title" 
        className="internal-links-title"
        itemProp="name"
      >
        {locale === 'ru' && 'Полезные разделы'}
        {locale === 'en' && 'Useful Sections'}
        {locale === 'pl' && 'Przydatne sekcje'}
      </h3>
      
      <ul className="internal-links-list" role="list">
        {relevantLinks.map((link, index) => (
          <li 
            key={link.path} 
            className="internal-link-item"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link 
              to={link.path}
              className="internal-link"
              title={link.description}
              aria-describedby={`link-desc-${index}`}
              itemProp="url"
            >
              <span className="internal-link-title" itemProp="name">
                {link.title}
              </span>
              <span 
                className="internal-link-description"
                id={`link-desc-${index}`}
              >
                {link.description}
              </span>
            </Link>
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ul>

      {/* Дополнительные SEO-оптимизированные ссылки */}
      <div className="contextual-links" aria-hidden="true">
        {currentPage === 'home' && (
          <div itemScope itemType="https://schema.org/WebPage">
            <meta itemProp="name" content="WanderEvents - Concert Tickets" />
            <meta itemProp="description" content="Find and book concert tickets across Europe" />
            <div itemProp="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
              <div itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <meta itemProp="position" content="1" />
                <span itemProp="name">Home</span>
              </div>
            </div>
          </div>
        )}
        
        {currentPage === 'faq' && (
          <div className="sr-only">
            <p>
              {locale === 'ru' && 'WanderEvents (вандеревентс) — ваша платформа для покупки билетов. '}
              {locale === 'en' && 'WanderEvents — your platform for buying tickets. '}
              {locale === 'pl' && 'WanderEvents — Twoja platforma do kupowania biletów. '}
              <Link to={`${getBasePath()}/`}>
                {locale === 'ru' && 'Вернуться на главную'}
                {locale === 'en' && 'Back to homepage'}
                {locale === 'pl' && 'Powrót do strony głównej'}
              </Link>
              {locale === 'ru' && ' или ознакомьтесь с '}
              {locale === 'en' && ' or learn about '}
              {locale === 'pl' && ' lub poznaj '}
              <Link to={`${getBasePath()}/welcome`}>
                {locale === 'ru' && 'информацией о нашей команде'}
                {locale === 'en' && 'our team information'}
                {locale === 'pl' && 'informacjami o naszym zespole'}
              </Link>.
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

// Компонент для встроенных контекстуальных ссылок внутри текста
export const ContextualLink = ({ 
  to, 
  children, 
  context = '', 
  className = '',
  ...props 
}) => {
  const { locale } = useLanguage();

  // Автоматически добавляем префикс языка если нужно
  const getLocalizedPath = (path) => {
    if (path.startsWith('/') && !path.startsWith('/ru') && !path.startsWith('/en') && !path.startsWith('/pl')) {
      const prefix = locale === 'ru' ? '' : `/${locale}`;
      return `${prefix}${path}`;
    }
    return path;
  };

  return (
    <Link 
      to={getLocalizedPath(to)}
      className={`contextual-link ${className}`}
      title={context}
      {...props}
    >
      {children}
    </Link>
  );
};

// Компонент для рекомендуемых страниц в подвале контента
export const RecommendedPages = ({ currentPage, maxItems = 3 }) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const getBasePath = () => locale === 'ru' ? '' : `/${locale}`;

  const recommendationConfig = {
    home: [
      { title: t('about_us_page.title', { defaultValue: 'О проекте' }), path: `${getBasePath()}/welcome` },
      { title: t('faq.brand.title', { defaultValue: 'FAQ' }), path: `${getBasePath()}/faq/brand` }
    ],
    about: [
      { title: t('header.events', { defaultValue: 'События' }), path: `${getBasePath()}/` },
      { title: t('faq.brand.title', { defaultValue: 'FAQ' }), path: `${getBasePath()}/faq/brand` }
    ],
    faq: [
      { title: t('header.events', { defaultValue: 'События' }), path: `${getBasePath()}/` },
      { title: t('about_us_page.title', { defaultValue: 'О проекте' }), path: `${getBasePath()}/welcome` }
    ]
  };

  const recommendations = recommendationConfig[currentPage]?.slice(0, maxItems) || [];

  if (recommendations.length === 0) return null;

  return (
    <aside 
      className="recommended-pages"
      aria-labelledby="recommended-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <h3 id="recommended-title" itemProp="name">
        {locale === 'ru' && 'Рекомендуем также'}
        {locale === 'en' && 'You might also like'}
        {locale === 'pl' && 'Możesz również polubić'}
      </h3>
      
      <ul className="recommended-list">
        {recommendations.map((rec, index) => (
          <li 
            key={rec.path}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            <Link 
              to={rec.path} 
              className="recommended-link"
              itemProp="url"
            >
              <span itemProp="name">{rec.title}</span>
            </Link>
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default InternalLinking;
