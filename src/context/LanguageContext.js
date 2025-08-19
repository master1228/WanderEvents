import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext({
  locale: 'ru', // Default value to prevent crash
  setLocale: () => console.warn('LanguageProvider not found'),
});

// Функция для определения начального языка
const getInitialLanguage = () => {
  // 1. Проверяем есть ли сохраненный выбор пользователя (приоритет!)
  const userChoice = localStorage.getItem('userLanguageChoice');
  if (userChoice && ['ru', 'en', 'pl'].includes(userChoice)) {
    console.log('🎯 Используем сохраненный выбор пользователя:', userChoice);
    return userChoice;
  }

  // 2. Если выбора нет, определяем язык браузера
  const browserLang = navigator.language || navigator.languages[0];
  const langCode = browserLang.toLowerCase().split('-')[0];
  
  // Поддерживаемые языки
  const supportedLanguages = ['ru', 'en', 'pl'];
  
  // Если язык браузера поддерживается, используем его
  if (supportedLanguages.includes(langCode)) {
    console.log('🌐 Используем язык браузера:', langCode);
    return langCode;
  }
  
  // 3. Иначе fallback на русский
  console.log('🔄 Fallback на русский язык');
  return 'ru';
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLanguage());
  const { i18n } = useTranslation();

  useEffect(() => {
    // Синхронизируем с i18next при инициализации
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);

  const handleSetLocale = (newLocale) => {
    console.log('🎯 Пользователь выбрал язык:', newLocale);
    setLocale(newLocale);
    i18n.changeLanguage(newLocale);
    
    // Сохраняем выбор пользователя в отдельный ключ
    localStorage.setItem('userLanguageChoice', newLocale);
    
    // Также сохраняем для i18next совместимости
    localStorage.setItem('i18nextLng', newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
