import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import SEOHead from '../components/SEOHead';
import '../styles/BrandFAQPage.scss';

const BrandFAQPage = () => {
  const { t } = useTranslation();
  const { locale } = useLanguage();

  // Получаем вопросы FAQ из переводов
  const faqData = t('faq.brand', { returnObjects: true });
  const questions = faqData?.questions || [];

  // Структурированные данные для Schema.org FAQPage
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": faqData?.title || "Brand FAQ",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };

  // Кастомные SEO метаданные для FAQ страницы
  const customTitle = `${faqData?.title || 'Brand FAQ'} | WanderEvents`;
  const customDescription = locale === 'ru' 
    ? "Часто задаваемые вопросы о бренде WanderEvents (вандеревентс). Узнайте больше о нашей платформе для покупки билетов на концерты и фестивали."
    : locale === 'pl'
    ? "Często zadawane pytania o marce WanderEvents. Dowiedz się więcej o naszej platformie do kupowania biletów na koncerty i festiwale."
    : "Frequently asked questions about WanderEvents brand. Learn more about our platform for booking concert and festival tickets.";

  return (
    <>
      <SEOHead 
        pageType="article"
        pagePath="faq/brand"
        customTitle={customTitle}
        customDescription={customDescription}
        structuredData={faqStructuredData}
      />
      
      <div className="brand-faq-page">
        <div className="container">
          <header className="faq-header">
            <h1 className="faq-title">{faqData?.title || 'Brand FAQ'}</h1>
            <p className="faq-intro">
              {locale === 'ru' && "Ответы на самые частые вопросы о бренде WanderEvents (вандеревентс)"}
              {locale === 'en' && "Answers to the most common questions about WanderEvents brand"}
              {locale === 'pl' && "Odpowiedzi na najczęstsze pytania o markę WanderEvents"}
            </p>
          </header>

          <div className="faq-content">
            {questions.length > 0 ? (
              questions.map((item, index) => (
                <div key={index} className="faq-item" itemScope itemType="https://schema.org/Question">
                  <h3 className="faq-question" itemProp="name">
                    {item.question}
                  </h3>
                  <div className="faq-answer" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer">
                    <div itemProp="text">
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-faq">
                {locale === 'ru' && "FAQ данные не найдены"}
                {locale === 'en' && "FAQ data not found"}  
                {locale === 'pl' && "Dane FAQ nie zostały znalezione"}
              </p>
            )}
          </div>

          <div className="faq-footer">
            <p className="brand-mention">
              {locale === 'ru' && (
                <>
                  <strong>WanderEvents (вандеревентс)</strong> — ваша надёжная платформа для покупки билетов на лучшие события в Европе. 
                  Часто можно встретить различные варианты написания нашего бренда: 
                  "Wanderevents", "Wander Events", "вандер евентс", "вандер ивентс", но официальное название — <strong>WanderEvents</strong>.
                </>
              )}
              {locale === 'en' && (
                <>
                  <strong>WanderEvents</strong> is your trusted platform for booking tickets to the best events across Europe. 
                  You might encounter different spellings of our brand like "Wanderevents" or "Wander Events", 
                  but the official name is <strong>WanderEvents</strong>.
                </>
              )}
              {locale === 'pl' && (
                <>
                  <strong>WanderEvents</strong> to Twoja zaufana platforma do rezerwacji biletów na najlepsze wydarzenia w Europie. 
                  Możesz spotkać różne warianty pisowni naszej marki jak "Wanderevents" czy "Wander Events", 
                  ale oficjalna nazwa to <strong>WanderEvents</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandFAQPage;
