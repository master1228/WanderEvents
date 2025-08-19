import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

const LanguageRoute = ({ children, language }) => {
  const { i18n } = useTranslation();
  const { setLocale } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Устанавливаем язык на основе маршрута
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
      setLocale(language);
    }
  }, [language, i18n, setLocale]);

  useEffect(() => {
    // Обработка редиректов для SEO
    const path = location.pathname;
    
    // Редирект /ru/ на корневой / (русский это x-default)
    if (path === '/ru' || path === '/ru/') {
      navigate('/', { replace: true });
      return;
    }

    // Редирект с trailing slash для языковых префиксов
    if (path === '/en' || path === '/pl') {
      navigate(path + '/', { replace: true });
      return;
    }

    // Редирект дублированных путей типа /ru/welcome на /welcome
    if (path.startsWith('/ru/')) {
      const newPath = path.replace('/ru/', '/');
      navigate(newPath, { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

  return children;
};

export default LanguageRoute;
