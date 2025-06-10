import React from 'react';
import '../styles/MobileMenu.scss';

const MobileMenu = ({ onMenuClick }) => {
  return (
    <div className="mobile-menu-container">
      <button className="mobile-menu-button" onClick={onMenuClick} aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default MobileMenu;
