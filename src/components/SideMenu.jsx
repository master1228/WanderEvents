import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../styles/SideMenu.scss';

const SideMenu = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <div className={`side-menu-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>
      <nav className={`side-menu ${isOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={handleLinkClick}>
              {t('header.events')}
            </Link>
          </li>
          <li>
            <Link to="/welcome" className={location.pathname === '/welcome' ? 'active' : ''} onClick={handleLinkClick}>
              {t('about_us_page.title')}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default SideMenu;
