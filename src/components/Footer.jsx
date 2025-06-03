import React from 'react';
import { FaInstagram, FaTelegramPlane, FaYoutube, FaTiktok, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  return (
    <footer id="contacts" className="footer-section">
      <div className="footer-content">
        {/* Левая колонка */}
        <div className="footer-left">
          <div className="footer-social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram className="footer-social-icon" /></a>
            <a href="https://t.me/wanderevents" target="_blank" rel="noopener noreferrer" aria-label="Telegram"><FaTelegramPlane className="footer-social-icon" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube className="footer-social-icon" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok className="footer-social-icon" /></a>
            {/* Добавьте другие иконки по необходимости */}
          </div>
          <div className="footer-links">
            <a href="https://t.me/wander_events_tickets" target="_blank" rel="noopener noreferrer" className="footer-link">Возврат билетов</a>
            <a href="#" className="footer-link">Соглашение пользователя</a>
            <a href="https://t.me/wanderevents" target="_blank" rel="noopener noreferrer" className="footer-link">Контакты</a>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="footer-right">
          <div className="footer-subscribe">
            <input type="email" placeholder="ВВЕДИТЕ ВАШ ИМЕЙЛ" className="footer-subscribe-input" />
            <button type="submit" className="footer-subscribe-button">ПОДПИСАТЬСЯ</button>
          </div>
          <div className="footer-info">
            <p className="footer-copyright">
              WanderEvents &copy; {new Date().getFullYear()} Все права защищены
            </p>
            <p className="footer-credits">
              Developed by NRAV
            </p>
          </div>
          <div className="footer-payment-icons">
            <FaCcVisa className="footer-payment-icon" aria-label="Visa"/>
            <FaCcMastercard className="footer-payment-icon" aria-label="Mastercard"/>
            <SiGooglepay className="footer-payment-icon" aria-label="Google Pay"/>
            {/* Добавьте другие иконки оплаты */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
