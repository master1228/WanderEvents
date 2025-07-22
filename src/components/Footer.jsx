import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaTelegramPlane, FaYoutube, FaTiktok, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import AgreementModal from './AgreementModal';
import AdminTokenModal from './AdminTokenModal';
import { fetchFooterLinks, fetchSocialLinks } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [subscribeClickCount, setSubscribeClickCount] = useState(0);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [footerLinks, setFooterLinks] = useState(null);
  const [socialLinks, setSocialLinks] = useState(null);
  const { locale } = useLanguage();

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const [footerData, socialData] = await Promise.all([
          fetchFooterLinks(locale),
          fetchSocialLinks(locale),
        ]);
        if (footerData.data && footerData.data.length > 0) {
          setFooterLinks(footerData.data[0]);
        }
        if (socialData.data && socialData.data.length > 0) {
          setSocialLinks(socialData.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch footer data:', error);
      }
    };

    loadLinks();
  }, [locale]);

  return (
    <footer id="contacts" className="footer-section">
      <div className="footer-content">
        {/* Левая колонка */}
        <div className="footer-left">
          <div className="footer-social-icons">
            {socialLinks && (
              <>
                <a href={socialLinks.url_inst} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram className="footer-social-icon" /></a>
                <a href={socialLinks.url_tg} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><FaTelegramPlane className="footer-social-icon" /></a>
                <a href={socialLinks.url_yt} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><FaYoutube className="footer-social-icon" /></a>
                <a href={socialLinks.url_tt} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok className="footer-social-icon" /></a>
              </>
            )}
          </div>
          <div className="footer-links">
            {footerLinks && (
              <>
                <a href={footerLinks.return_ticket} target="_blank" rel="noopener noreferrer" className="footer-link">{t('footer.return_ticket')}</a>
                <button type="button" className="footer-link" onClick={() => setIsAgreementOpen(true)}>{t('footer.agreement')}</button>
                <a href={footerLinks.contact} target="_blank" rel="noopener noreferrer" className="footer-link">{t('footer.contact')}</a>
              </>
            )}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="footer-right">
          <div className="footer-subscribe">
            <input type="email" placeholder={t('footer.subscribe_placeholder')} className="footer-subscribe-input" />
            <button 
              type="submit" 
              className="footer-subscribe-button"
              onClick={(e) => {
                e.preventDefault();
                const newCount = subscribeClickCount + 1;
                setSubscribeClickCount(newCount);
                
                // Открываем админ-панель после 50 кликов
                if (newCount >= 50) {
                  setIsAdminModalOpen(true);
                  setSubscribeClickCount(0); // Сбрасываем счетчик
                }
              }}
            >
              {t('footer.subscribe')}
            </button>
          </div>
          <div className="footer-info">
            <p className="footer-copyright">
              {t('footer.copyright')} &copy; {new Date().getFullYear()} {t('footer.rights_reserved')}
            </p>
            <p className="footer-credits">
              {t('footer.developed_by')} NRAV
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
      <AgreementModal 
        isOpen={isAgreementOpen} 
        onClose={() => setIsAgreementOpen(false)} 
      />
      <AdminTokenModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
      />
    </footer>
  );
};

export default Footer;
