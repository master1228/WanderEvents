import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAgreement } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import '../styles/TicketModal.scss';

const AgreementModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { locale } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      const loadAgreement = async () => {
        setLoading(true);
        setContent(''); // Reset content to show loading spinner
        try {
          const response = await fetchAgreement(locale);
          if (response.data && response.data.length > 0 && response.data[0].agr) {
            const contentArray = response.data[0].agr;
            const htmlContent = contentArray.map(block => {
              if (block.type === 'paragraph') {
                const text = block.children.map(child => child.text).join('');
                return `<p>${text}</p>`;
              }
              return '';
            }).join('');
            setContent(htmlContent);
          } else {
            // Handle case where translation might not exist
            setContent(`<p>${t('agreement_modal.translation_missing')}</p>`);
          }
        } catch (error) {
          console.error('Failed to fetch agreement:', error);
          setContent(`<p>${t('agreement_modal.agreement_fetch_error')}</p>`);
        } finally {
          setLoading(false);
        }
      };
      loadAgreement();
    }
  }, [isOpen, locale]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="ticket-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-content">
          <h2>{t('agreement_modal.agreement_title')}</h2>
          {loading ? (
            <p>{t('agreement_modal.loading')}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
