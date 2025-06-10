import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext({
  locale: 'ru', // Default value to prevent crash
  setLocale: () => console.warn('LanguageProvider not found'),
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('ru'); // Русский язык по умолчанию

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
