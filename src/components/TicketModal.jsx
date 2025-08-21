import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/TicketModal.scss';

const TicketModal = ({ isOpen, onClose, event }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  // Find the tickets array, whether it's on the main event or in a localization
  const tickets = event.tickets || (event.localizations && event.localizations[0]?.tickets) || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="ticket-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <h2 className="modal-title">{t('ticket_modal.tickets_for', { eventName: event.concertTitle })}</h2>
          
          <div className="event-details">
            <div className="modal-event-info">
              <div className="detail-row">
                <span className="detail-label">{t('ticket_modal.place')}:</span>
                <span className="detail-value">{event.city}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('ticket_modal.date')}:</span>
                <span className="detail-value">{event.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('ticket_modal.time')}:</span>
                <span className="detail-value">{event.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">{t('ticket_modal.club')}:</span>
                <span className="detail-value">{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>
          
          <div className="ticket-options">
            <h3>{t('ticket_modal.select_ticket_type')}</h3>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div className="ticket-type" key={ticket.id}>
                  <div className="ticket-info">
                    <h4>{ticket.type}</h4>
                    {ticket.description && <p>{ticket.description}</p>}
                  </div>
                  <div className="ticket-price">
                    {ticket.price ? `${ticket.price} ${ticket.currency_symbol || ''}` : t('ticket_modal.not_available')}
                  </div>
                  <button
                    className="select-ticket"
                    onClick={() => window.open(ticket.purchase_url || 'https://t.me/wander_events_tickets', '_blank')}
                  >
                    {t('ticket_modal.buy')}
                  </button>
                </div>
              ))
            ) : (
              <p>{t('ticket_modal.tickets_unavailable')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
