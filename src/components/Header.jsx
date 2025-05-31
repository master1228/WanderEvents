import React from 'react';
import '../styles/Header.scss';

const Header = () => {
  return (
    <header id="main-header" className="header">
      <div className="header__container" style={{ background: 'transparent' }}>
        <nav className="header__nav header__nav-left">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <a href="#events" className="header__nav-link">СОБЫТИЯ</a>
            </li>
          </ul>
        </nav>
        
        <div className="header__brand">
          <a href="#app-top" className="header__brand-text">WanderEvents</a>
        </div>
        
        <nav className="header__nav header__nav-right">
          <ul className="header__nav-list">
            <li className="header__nav-item">
              <a href="#contacts" className="header__nav-link">КОНТАКТЫ</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
