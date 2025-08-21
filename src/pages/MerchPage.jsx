import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { fetchMerchItems } from '../utils/api';
import { FaChevronDown } from 'react-icons/fa';
import ImageCarousel from '../components/ImageCarousel';
import '../styles/MerchPage.scss';

const MerchPage = () => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  
  // Состояние для фильтрации
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Состояние для данных из Strapi
  const [merchItems, setMerchItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect для загрузки данных мерча из Strapi
  useEffect(() => {
    const loadMerchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const items = await fetchMerchItems(locale);
        setMerchItems(items);
        
      } catch (err) {
        console.error('Error loading merch items:', err);
        setError(err.message || 'Ошибка загрузки товаров');
      } finally {
        setLoading(false);
      }
    };

    loadMerchItems();
  }, [locale]);

  // Подсчет товаров по категориям из текущих данных
  const categoryCounts = useMemo(() => {
    return {
      all: merchItems.length,
      clothing: merchItems.filter(item => item.category === 'clothing').length,
      accessories: merchItems.filter(item => item.category === 'accessories').length
    };
  }, [merchItems]);

  // Функция для смены фильтра с анимацией
  const handleFilterChange = async (filterType) => {
    if (filterType === activeFilter) return;
    
    setIsAnimating(true);
    setActiveFilter(filterType);
    
    try {
      // Загружаем новые данные с фильтром
      const items = await fetchMerchItems(locale, filterType);
      setMerchItems(items);
    } catch (err) {
      console.error('Error filtering merch items:', err);
      setError(err.message || 'Ошибка фильтрации товаров');
    }
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 200);
  };

  const generateStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">★</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </div>
    );
  };

  // Функция для обработки покупки
  const handlePurchase = (purchaseUrl) => {
    if (purchaseUrl && purchaseUrl !== '#') {
      // Открываем ссылку в новой вкладке
      window.open(purchaseUrl, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Purchase URL not available');
    }
  };

  // Функция для прокрутки к товарам
  const scrollToMerch = () => {
    const section = document.querySelector('.merch-filters');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="merch-page">
      <div className="scroll-indicator" onClick={scrollToMerch} role="button">
        <div className="scroll-text">{t('scroll_down')}</div>
        <FaChevronDown className="scroll-arrow" />
      </div>
      
      <div className="merch-filters">
        <div className="filter-group" data-locale={locale}>
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            <span className="filter-text">
              <span className="filter-text-full">
                {locale === 'ru' && 'Все товары'}
                {locale === 'en' && 'All Items'}
                {locale === 'pl' && 'Wszystkie przedmioty'}
              </span>
              <span className="filter-text-short">
                {locale === 'ru' && 'Все'}
                {locale === 'en' && 'All'}
                {locale === 'pl' && 'Wszystkie'}
              </span>
            </span>
            <span className="filter-count">{categoryCounts.all}</span>
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'clothing' ? 'active' : ''}`}
            onClick={() => handleFilterChange('clothing')}
          >
            <span className="filter-text">
              <span className="filter-text-full">
                {locale === 'ru' && 'Одежда'}
                {locale === 'en' && 'Clothing'}
                {locale === 'pl' && 'Odzież'}
              </span>
              <span className="filter-text-short">
                {locale === 'ru' && 'Одежда'}
                {locale === 'en' && 'Clothes'}
                {locale === 'pl' && 'Ubrania'}
              </span>
            </span>
            <span className="filter-count">{categoryCounts.clothing}</span>
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'accessories' ? 'active' : ''}`}
            onClick={() => handleFilterChange('accessories')}
          >
            <span className="filter-text">
              <span className="filter-text-full">
                {locale === 'ru' && 'Аксессуары'}
                {locale === 'en' && 'Accessories'}
                {locale === 'pl' && 'Akcesoria'}
              </span>
              <span className="filter-text-short">
                {locale === 'ru' && 'Аксес.'}
                {locale === 'en' && 'Access.'}
                {locale === 'pl' && 'Akces.'}
              </span>
            </span>
            <span className="filter-count">{categoryCounts.accessories}</span>
          </button>
        </div>
      </div>

      {/* Показываем загрузку */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Загружаем товары...</p>
        </div>
      )}

      {/* Показываем ошибку */}
      {error && (
        <div className="error-container">
          <p>❌ {error}</p>
          <button onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      )}

      {/* Показываем "SOLDOUT" если товаров нет */}
      {!loading && !error && merchItems.length === 0 && (
        <div className="soldout-container">
          <div className="soldout-main">
            {locale === 'ru' && 'ВОУУ SOLDOUT'}
            {locale === 'en' && 'WOOW SOLDOUT'}
            {locale === 'pl' && 'WOOW SOLDOUT'}
          </div>
          <div className="soldout-subtitle">
            {locale === 'ru' && 'жди новый завоз ну или перезавоз )'}
            {locale === 'en' && 'wait for new stock or restock )'}
            {locale === 'pl' && 'czekaj na nowy towar lub uzupełnienie )'}
          </div>
        </div>
      )}

      {/* Показываем товары */}
      {!loading && !error && merchItems.length > 0 && (
        <div className={`merch-grid ${isAnimating ? 'animating' : ''}`}>
          {merchItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`merch-card ${!item.inStock ? 'out-of-stock' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item.isLimited && (
              <div className="limited-badge">
                {locale === 'ru' && 'Limited'}
                {locale === 'en' && 'Limited'}
                {locale === 'pl' && 'Limited'}
              </div>
            )}
            
            <div className="merch-image">
              <ImageCarousel 
                images={item.images} 
                alt={item.name[locale]}
                className="merch-carousel"
              />
              {!item.inStock && (
                <div className="stock-overlay">
                  <span>
                    {locale === 'ru' && 'Нет в наличии'}
                    {locale === 'en' && 'Out of Stock'}
                    {locale === 'pl' && 'Brak w magazynie'}
                  </span>
                </div>
              )}
            </div>

            <div className="merch-info">
              <h3 className="merch-name">{item.name[locale]}</h3>
              <p className="merch-description">{item.description[locale]}</p>
              
              <div className="merch-details">
                <div className="detail-item">
                  <span className="detail-label">
                    {locale === 'ru' && 'Цвета:'}
                    {locale === 'en' && 'Colors:'}
                    {locale === 'pl' && 'Kolory:'}
                  </span>
                  <span className="detail-value">{item.availableColors[locale]}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    {locale === 'ru' && 'Размеры:'}
                    {locale === 'en' && 'Sizes:'}
                    {locale === 'pl' && 'Rozmiary:'}
                  </span>
                  <span className="detail-value">{item.availableSizes}</span>
                </div>
              </div>

              <div className="merch-purchase">
                <div className="price">{item.price} {item.currency}</div>
                <button 
                  className={`add-to-cart-btn ${!item.inStock ? 'disabled' : ''}`}
                  disabled={!item.inStock}
                  onClick={() => handlePurchase(item.purchaseUrl)}
                >
                  {item.inStock ? (
                    <>
                      {locale === 'ru' && 'Перейти к покупке'}
                      {locale === 'en' && 'Buy Now'}
                      {locale === 'pl' && 'Kup teraz'}
                    </>
                  ) : (
                    <>
                      {locale === 'ru' && 'Нет в наличии'}
                      {locale === 'en' && 'Out of Stock'}
                      {locale === 'pl' && 'Brak w magazynie'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default MerchPage;
