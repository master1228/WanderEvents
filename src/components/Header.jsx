import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => {
  const { t } = useTranslation();
  return (
    <header id="main-header" className="header">
      <div className="header__container" style={{ background: 'transparent' }}>
        <nav className="header__nav header__nav-left">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/" state={{ scrollToEvents: true }} className="header__nav-link">{t('header.events')}</Link>
            </li>
          </ul>
        </nav>
        
        <div className="header__brand">
          <Link to="/" className="header__brand-text">WANDEREVENTS</Link>
        </div>
        
        <nav className="header__nav header__nav-right">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <Link to="/welcome" className="header__nav-link">{t('header.contacts')}</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
