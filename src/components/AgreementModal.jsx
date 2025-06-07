import React from 'react';
import UserAgreement from '../pages/UserAgreement';
import '../styles/TicketModal.scss';

const AgreementModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="ticket-modal">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="modal-content">
          <UserAgreement />
        </div>
      </div>
    </div>
  );
};

export default AgreementModal;
