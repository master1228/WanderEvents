import React from 'react';
import '../styles/TicketModal.scss';

const TicketModal = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="ticket-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="modal-content">
          <h2 className="modal-title">БИЛЕТЫ НА {event.concertTitle}</h2>
          
          <div className="event-details">
            <div className="modal-event-info">
              <div className="detail-row">
                <span className="detail-label">Место:</span>
                <span className="detail-value">{event.city}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Дата:</span>
                <span className="detail-value">{event.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Время:</span>
                <span className="detail-value">{event.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Клуб:</span>
                <span className="detail-value">{event.venue}, {event.city}</span>
              </div>
            </div>
          </div>
          
          <div className="ticket-options">
            <h3>ВЫБЕРИТЕ ТИП БИЛЕТА</h3>
            {event.tickets && event.tickets.length > 0 ? (
              event.tickets.map((ticket) => (
                <div className="ticket-type" key={ticket.id}>
                  <div className="ticket-info">
                    <h4>{ticket.type}</h4>
                    {ticket.description && <p>{ticket.description}</p>}
                  </div>
                  <div className="ticket-price">
                    {ticket.price ? `${ticket.price} ${ticket.currency_symbol || ''}` : '—'}
                  </div>
                  <button
                    className="select-ticket"
                    onClick={() => window.open('https://t.me/wander_events_tickets', '_blank')}
                  >
                    КУПИТЬ
                  </button>
                </div>
              ))
            ) : (
              <p>Билеты недоступны</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
