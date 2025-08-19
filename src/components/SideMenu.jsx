import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import '../styles/SideMenu.scss';

const SideMenu = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const location = useLocation();

  const handleLinkClick = () => {
    onClose();
  };

  // Генерируем правильные пути для каждого языка
  const getLocalizedPath = (path) => {
    if (locale === 'ru') {
      return path;
    }
    return `/${locale}${path}`;
  };

  return (
    <>
      <div className={`side-menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <nav className={`side-menu ${isOpen ? 'open' : ''}`}>
        <h4 className="side-menu-title">{t('side_menu.title', 'МЕНЮ')}</h4>
        <ul>
          <li>
            <Link 
              to={getLocalizedPath('/')} 
              className={location.pathname === getLocalizedPath('/') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              {t('header.events')}
            </Link>
          </li>
          <li>
            <Link 
              to={getLocalizedPath('/merch')} 
              className={location.pathname === getLocalizedPath('/merch') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              {t('header.merch')}
            </Link>
          </li>
          <li>
            <Link 
              to={getLocalizedPath('/welcome')} 
              className={location.pathname === getLocalizedPath('/welcome') ? 'active' : ''} 
              onClick={handleLinkClick}
            >
              {t('about_us_page.title')}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideMenu;
