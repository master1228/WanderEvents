import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const SemanticPageWrapper = ({ 
  children, 
  pageType = 'main',
  showBreadcrumbs = false,
  breadcrumbs = [],
  headerLevel = 1
}) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Генерируем хлебные крошки
  const renderBreadcrumbs = () => {
    if (!showBreadcrumbs || breadcrumbs.length === 0) return null;

    return (
      <nav aria-label="Breadcrumb" className="breadcrumb-nav">
        <ol 
          className="breadcrumb-list" 
          itemScope 
          itemType="https://schema.org/BreadcrumbList"
          role="navigation"
        >
          {breadcrumbs.map((crumb, index) => (
            <li 
              key={index}
              className="breadcrumb-item"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index < breadcrumbs.length - 1 ? (
                <a 
                  href={crumb.url} 
                  itemProp="item"
                  className="breadcrumb-link"
                  title={crumb.name}
                >
                  <span itemProp="name">{crumb.name}</span>
                </a>
              ) : (
                <span itemProp="name" className="breadcrumb-current" aria-current="page">
                  {crumb.name}
                </span>
              )}
              <meta itemProp="position" content={index + 1} />
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator" aria-hidden="true">›</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  };

  // Определяем тег для основного заголовка
  const HeaderTag = `h${headerLevel}`;

  return (
    <div 
      className={`semantic-page-wrapper page-type-${pageType}`}
      itemScope
      itemType="https://schema.org/WebPage"
      lang={locale}
    >
      {/* Скрытый заголовок для скринридеров */}
      <HeaderTag className="sr-only" id="main-heading">
        {pageType === 'home' && t('seo.title', { defaultValue: 'WanderEvents - Concert & Festival Tickets' })}
        {pageType === 'faq' && t('faq.brand.title', { defaultValue: 'Brand FAQ' })}
        {pageType === 'about' && t('about_us_page.title', { defaultValue: 'About Us' })}
      </HeaderTag>

      {/* Навигация-хлебные крошки */}
      {renderBreadcrumbs()}

      {/* Основной контент */}
      <main 
        id="main-content"
        className="main-content"
        role="main"
        tabIndex="-1"
        aria-labelledby="main-heading"
        itemProp="mainContentOfPage"
      >
        {children}
      </main>

      {/* Дополнительная семантическая разметка для разных типов страниц */}
      {pageType === 'home' && (
        <>
          {/* Дополнительная информация о сайте для поисковиков */}
          <div 
            className="sr-only" 
            itemScope 
            itemType="https://schema.org/WebSite"
            aria-hidden="true"
          >
            <meta itemProp="name" content="WanderEvents" />
            <meta itemProp="description" content={t('seo.description', { defaultValue: 'Concert and festival tickets' })} />
            <meta itemProp="url" content="https://wanderevents.pl" />
            <div itemProp="potentialAction" itemScope itemType="https://schema.org/SearchAction">
              <meta itemProp="target" content="https://wanderevents.pl/search?q={search_term_string}" />
              <meta itemProp="query-input" content="required name=search_term_string" />
            </div>
          </div>

          {/* Информация об организации */}
          <div 
            className="sr-only"
            itemScope 
            itemType="https://schema.org/Organization"
            aria-hidden="true"
          >
            <meta itemProp="name" content="WanderEvents" />
            <meta itemProp="alternateName" content="Вандеревентс" />
            <meta itemProp="alternateName" content="Wanderevents" />
            <meta itemProp="url" content="https://wanderevents.pl" />
            <meta itemProp="logo" content="https://wanderevents.pl/assets/icons/favicon-96x96.png" />
            <div itemProp="areaServed" itemScope itemType="https://schema.org/Place">
              <meta itemProp="name" content="Europe" />
            </div>
          </div>
        </>
      )}

      {/* Skip link скрыт полностью для обычных пользователей, но доступен роботам */}
    </div>
  );
};

export default SemanticPageWrapper;
