import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext({
  locale: 'ru', // Default value to prevent crash
  setLocale: () => console.warn('LanguageProvider not found'),
});

// Функция для определения языка браузера
const getBrowserLanguage = () => {
  const savedLang = localStorage.getItem('i18nextLng');
  if (savedLang && ['ru', 'en', 'pl'].includes(savedLang)) {
    return savedLang;
  }

  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.toLowerCase().split('-')[0];
  
  // Поддерживаемые языки
  const supportedLanguages = ['ru', 'en', 'pl'];
  
  // Если язык браузера поддерживается, используем его
  if (supportedLanguages.includes(langCode)) {
    return langCode;
  }
  
  // Иначе fallback на русский
  return 'ru';
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(getBrowserLanguage());
  const { i18n } = useTranslation();

  useEffect(() => {
    // Синхронизируем с i18next при инициализации
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  const handleSetLocale = (newLocale) => {
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    localStorage.setItem('i18nextLng', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
