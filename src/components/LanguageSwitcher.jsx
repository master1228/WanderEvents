import React, { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import '../styles/LanguageSwitcher.scss';

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setLocale } = useLanguage();
  const { i18n } = useTranslation();
  const languages = [
    { code: 'ru', name: 'RU' },
    { code: 'en', name: 'EN' },
    { code: 'pl', name: 'PL' },
  ];

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLocale(lang); // Update context as well
    setIsOpen(false);
  };



  return (
    <div className={`language-switcher ${isOpen ? 'open' : ''}`}>
      <button className="switcher-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Select language">
        <FaGlobe />
      </button>
      <div className="language-options">
        {languages.map((lang) => (
          <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}>
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
