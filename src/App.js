import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import LanguageSwitcher from './components/LanguageSwitcher';
import MobileMenu from './components/MobileMenu';
import SideMenu from './components/SideMenu';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import './styles/App.scss';

// This component applies the language attribute to the HTML tag.
const LanguageEffect = () => {
  const { locale } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null; // This component does not render anything.
};

const App = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when the menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);
  return (
    <LanguageProvider>
      <Router>
        <ScrollToTop />
        <LanguageEffect />
        <div className="App">
          <MobileMenu onMenuClick={() => setMenuOpen(true)} />
          <SideMenu isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />
          <LanguageSwitcher />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/welcome" element={<LandingPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  );
};

export default App;
