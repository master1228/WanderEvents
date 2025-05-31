import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaClock, FaTicket, FaChevronDown } from 'react-icons/fa';
import '../styles/HomePage.scss';
import TicketModal from '../components/TicketModal';
import { fetchEvents } from '../utils/api';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true); // Добавим setLoading(true) в начало
      try {
        const data = await fetchEvents();
        console.log('Raw API Response Data:', data); // Оставим для проверки

        if (data && Array.isArray(data.data)) {
          const formatted = data.data.map((item, index) => {
            console.log(`Processing item[${index}]:`, item); // item УЖЕ должен быть объектом с атрибутами + id

            // Формируем URL для изображения
            // Базовый URL Strapi (без /api)
            const strapiBaseUrl = (process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337/api').replace('/api', '');
            const imageUrl = item.image && item.image.url ? `${strapiBaseUrl}${item.image.url}` : '';
            
            // Обработка описания (RichText) - пока просто возьмем как есть или первую строку
            let eventDescription = '';
            if (Array.isArray(item.description) && item.description.length > 0) {
              // Попытка извлечь текст из первого параграфа, если это стандартный RichText
              const firstBlock = item.description[0];
              if (firstBlock && firstBlock.type === 'paragraph' && Array.isArray(firstBlock.children) && firstBlock.children.length > 0 && firstBlock.children[0].text) {
                eventDescription = firstBlock.children[0].text;
              } else {
                // Если не удалось, или структура другая, можно попробовать JSON.stringify или оставить пустым
                eventDescription = 'Подробное описание скоро появится.'; // Заглушка
              }
            } else if (typeof item.description === 'string') {
              eventDescription = item.description;
            }


            return {
              id: item.id,
              concertTitle: item.name, // Прямой доступ к item.name
              date: item.date,
              time: item.time,
              city: item.city,
              venue: item.venue,
              description: eventDescription, // Используем обработанное описание
              posterImage: imageUrl, // Используем полный URL изображения
              performingArtists: item.performing_artists || '', // Добавляем новое поле для артистов
              tickets: Array.isArray(item.tickets) ? item.tickets.map((t) => ({
                id: t.id, // Предполагаем, что у билета есть id
                type: t.type,
                price: t.price,
                description: t.description,
                currency_symbol: t.currency_symbol // Добавляем символ валюты
              })) : [],
              sold_out: false // Расширить схему позже
            };
          });
          setEvents(formatted);
        } else {
          console.error('Данные от API не в ожидаемом формате:', data);
          setEvents([]); // Устанавливаем пустой массив, если данные некорректны
        }
      } catch (e) {
        console.error('Ошибка загрузки событий', e);
        setEvents([]); // Устанавливаем пустой массив в случае ошибки
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  if (loading) {
    return <div className="home-page"><p style={{color: '#fff'}}>Загрузка...</p></div>;
  }

  return (
    <div className="home-page">
      <div className="events-container">
        <div className="artist-header">
          <div className="scroll-indicator">
            <div className="scroll-text">листай дальше</div>
            <FaChevronDown className="scroll-arrow" />
          </div>
        </div>
        
        <div id="events" className="events-list">
          {events.map((event, index) => (
            <div className="event-card" key={index}>
              <h2 className="event-concert-title">{event.concertTitle}</h2>
              <div className="event-main-content">
                <img
                  src={event.posterImage.startsWith('http') ? event.posterImage : `${process.env.REACT_APP_STRAPI_URL?.replace('/api','') || ''}${event.posterImage}`}
                  alt={event.venue}
                  className="event-poster"
                />
                <div className="event-middle-content">
                  <div className="event-city-date-time-wrapper"> {/* New wrapper */}
                    <div className="event-location-large">
                      {event.city} <span className="dot-separator">•</span> {event.date}
                    </div>
                    <div className="event-time-display">START - {event.time}</div>
                    <div className="event-venue-display">PLACE - VOODOO CLUB</div>
                    <div className="event-artists-display">LIVE - {event.performingArtists}</div>
                  </div>
                  <p className="event-short-description">{event.description}</p>
                  <div className="event-action">
                    {event.sold_out ? (
                      <div className="event-sold-out">SOLD OUT</div>
                    ) : (
                      <button className="event-buy-button" onClick={() => openModal(event)}>КУПИТЬ БИЛЕТ</button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
      {selectedEvent && (
        <TicketModal 
          isOpen={modalOpen} 
          onClose={closeModal} 
          event={selectedEvent} 
        />
      )}
    </div>
  );
};

export default HomePage;
