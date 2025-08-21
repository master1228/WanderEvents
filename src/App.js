import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import BrandFAQPage from './pages/BrandFAQPage';
import MerchPage from './pages/MerchPage';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import MobileMenu from './components/MobileMenu';
import SideMenu from './components/SideMenu';
import ScrollToTop from './components/ScrollToTop';
import LanguageRoute from './components/LanguageRoute';
import AdvancedSEOHead from './components/AdvancedSEOHead';
import SemanticPageWrapper from './components/SemanticPageWrapper';
import CountdownTimer from './components/CountdownTimer';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { fetchCountdownConfig } from './utils/api';
import './styles/App.scss';
import './styles/SemanticSEO.scss';

// This component applies the language attribute to the HTML tag.
const LanguageEffect = () => {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null; // This component does not render anything.
};

// Component that has access to language context
const AppContent = () => {
  const { locale } = useLanguage();
  const [isMenuOpen, setMenuOpen] = useState(false);
  // Состояние для таймера
  const [countdownConfig, setCountdownConfig] = useState({
    targetDate: '2024-08-31T18:00:00', // Демо дата 31 августа
    isVisible: true,
    title: null
  });

  useEffect(() => {
    // Prevent body scroll when the menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  // Загружаем конфигурацию таймера
  useEffect(() => {
    async function loadCountdownConfig() {
      try {
        const config = await fetchCountdownConfig(locale);
        setCountdownConfig(prevConfig => ({
          ...prevConfig,
          ...config
        }));
      } catch (error) {
        console.error('Failed to load countdown config:', error);
      }
    }
    loadCountdownConfig();
  }, [locale]);

  return (
    <div className="App">
      <MobileMenu onMenuClick={() => setMenuOpen(true)} />
      <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
      <LanguageSwitcher />
      <Header />
      {/* Глобальный таймер на всех страницах */}
      <CountdownTimer 
        targetDate={countdownConfig.targetDate}
        isVisible={countdownConfig.isVisible}
        title={countdownConfig.title}
      />
      <main>
        <Routes>
          {/* Русский язык (x-default) - корневые пути */}
          <Route path="/" element={
            <LanguageRoute language="ru">
              <AdvancedSEOHead pageType="website" pagePath="" />
              <SemanticPageWrapper pageType="home" headerLevel={1}>
                <HomePage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/welcome" element={
            <LanguageRoute language="ru">
              <AdvancedSEOHead pageType="website" pagePath="welcome" />
              <SemanticPageWrapper 
                pageType="about" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <LandingPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/faq/brand" element={
            <LanguageRoute language="ru">
              <AdvancedSEOHead 
                pageType="article" 
                pagePath="faq/brand"
                structuredData={{
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": []
                }}
              />
              <SemanticPageWrapper 
                pageType="faq" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <BrandFAQPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/merch" element={
            <LanguageRoute language="ru">
              <AdvancedSEOHead pageType="website" pagePath="merch" />
              <SemanticPageWrapper 
                pageType="shop" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <MerchPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />

          {/* Английский язык */}
          <Route path="/en/" element={
            <LanguageRoute language="en">
              <AdvancedSEOHead pageType="website" pagePath="" />
              <SemanticPageWrapper pageType="home" headerLevel={1}>
                <HomePage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/en/welcome" element={
            <LanguageRoute language="en">
              <AdvancedSEOHead pageType="website" pagePath="welcome" />
              <SemanticPageWrapper 
                pageType="about" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <LandingPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/en/faq/brand" element={
            <LanguageRoute language="en">
              <AdvancedSEOHead 
                pageType="article" 
                pagePath="faq/brand"
                structuredData={{
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": []
                }}
              />
              <SemanticPageWrapper 
                pageType="faq" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <BrandFAQPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/en/merch" element={
            <LanguageRoute language="en">
              <AdvancedSEOHead pageType="website" pagePath="merch" />
              <SemanticPageWrapper 
                pageType="shop" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <MerchPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />

          {/* Польский язык */}
          <Route path="/pl/" element={
            <LanguageRoute language="pl">
              <AdvancedSEOHead pageType="website" pagePath="" />
              <SemanticPageWrapper pageType="home" headerLevel={1}>
                <HomePage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/pl/welcome" element={
            <LanguageRoute language="pl">
              <AdvancedSEOHead pageType="website" pagePath="welcome" />
              <SemanticPageWrapper 
                pageType="about" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <LandingPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/pl/faq/brand" element={
            <LanguageRoute language="pl">
              <AdvancedSEOHead 
                pageType="article" 
                pagePath="faq/brand"
                structuredData={{
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": []
                }}
              />
              <SemanticPageWrapper 
                pageType="faq" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <BrandFAQPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />
          <Route path="/pl/merch" element={
            <LanguageRoute language="pl">
              <AdvancedSEOHead pageType="website" pagePath="merch" />
              <SemanticPageWrapper 
                pageType="shop" 
                showBreadcrumbs={false}
                headerLevel={1}
              >
                <MerchPage />
              </SemanticPageWrapper>
            </LanguageRoute>
          } />

          {/* Редирект-маршруты для /ru/ (редиректят на корневые пути) */}
          <Route path="/ru" element={<LanguageRoute language="ru"><HomePage /></LanguageRoute>} />
          <Route path="/ru/" element={<LanguageRoute language="ru"><HomePage /></LanguageRoute>} />
          <Route path="/ru/*" element={<LanguageRoute language="ru"><HomePage /></LanguageRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <LanguageEffect />
        <AppContent />
      </Router>
    </LanguageProvider>
  );
};

export default App;
