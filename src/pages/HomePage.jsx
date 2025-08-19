import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/HomePage.scss';
import TicketModal from '../components/TicketModal';
import { fetchEvents, getStrapiBaseUrl } from '../utils/api';
import { useLanguage } from '../context/LanguageContext';
import overlayImg from '../assets/images/Untwrwitled-1.png';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { locale } = useLanguage();
  const { t } = useTranslation();
  const location = useLocation();
  const eventsRef = useRef(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true); 
      try {
        const data = await fetchEvents(locale);

        if (data && Array.isArray(data.data)) {
          // Получаем базовый URL асинхронно один раз перед обработкой
          const strapiBaseUrl = await getStrapiBaseUrl();
          
          const formatted = data.data.map((item, index) => {
            // Prioritize img_url, then fall back to the uploaded image
            const imageUrl = item.img_url || (item.image && (item.image.url || item.image.formats?.thumbnail?.url)
              ? `${strapiBaseUrl}${item.image.url || item.image.formats.thumbnail.url}`
              : '');
            
            let eventDescription = '';
            if (Array.isArray(item.description) && item.description.length > 0) {
              const firstBlock = item.description[0];
              if (firstBlock && firstBlock.type === 'paragraph' && Array.isArray(firstBlock.children) && firstBlock.children.length > 0 && firstBlock.children[0].text) {
                eventDescription = firstBlock.children[0].text;
              } else {
                eventDescription = 'Подробное описание скоро появится.'; 
              }
            } else if (typeof item.description === 'string') {
              eventDescription = item.description;
            }


            return {
              id: item.id,
              concertTitle: item.name, 
              date: item.date,
              time: item.time,
              city: item.city,
              venue: item.venue,
              description: eventDescription, 
              posterImage: imageUrl, 
              performingArtists: item.performing_artists || '', 
              tickets: Array.isArray(item.tickets) ? item.tickets.map((t) => ({
                id: t.id, 
                type: t.type,
                price: t.price,
                description: t.description,
                currency_symbol: t.currency_symbol, 
                purchase_url: t.purchase_url 
              })) : [],
              soldout: item.soldout || false
            };
          });
          setEvents(formatted);
        } else {
          setEvents([]);
        }
      } catch (e) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [locale]);

  useEffect(() => {
    // Only scroll if the navigation state is set AND the events have been loaded.
    if (location.state?.scrollToEvents && eventsRef.current && events.length > 0) {
      eventsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state, events]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const scrollToEvents = () => {
    const section = document.getElementById('events');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <div className="events-container">
        <div className="artist-header">
          <div className="scroll-indicator" onClick={scrollToEvents} role="button">
            <div className="scroll-text">{t('scroll_down')}</div>
            <FaChevronDown className="scroll-arrow" />
          </div>
        </div>
        
        {loading && (
          <div className="loading-spinner-container">
            <div className="dot-spinner">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <p className="loading-text">{t('loading')}</p>
          </div>
        )}
        {!loading && (
          <>
            {/* Упоминание бренда для русской версии (для SEO) */}
            {locale === 'ru' && (
              <div className="brand-mention-section">
                <p className="brand-mention-text">
                  <strong>WanderEvents (вандеревентс)</strong> — ваша надёжная платформа для покупки билетов на лучшие концерты и фестивали в Европе.
                </p>
              </div>
            )}
            
            <div id="events" className="events-list" ref={eventsRef}>
            {events.map((event, index) => (
              <div className="event-card" key={index}>
                {event.soldout && (
                  <div className="event-overlay">
                    <img src={overlayImg} alt="Недоступно" className="overlay-image" />
                  </div>
                )}
                <h2 className="event-concert-title">{event.concertTitle}</h2>
                <div className="event-main-content">
                  <img loading="lazy"
                    src={event.posterImage}
                    alt={event.venue}
                    className="event-poster"
                  />
                  <div className="event-middle-content">
                    <div className="event-city-date-time-wrapper"> 
                      <div className="event-location-large">
                        {event.city}
                        <br className="mobile-break" />
                        <span className="event-date"> {event.date}</span>
                      </div>
                      <div className="event-time-display">START - {event.time}</div>
                      <div className="event-venue-display">PLACE - VOODOO CLUB</div>
                      <div className="event-artists-display">LIVE - {event.performingArtists}</div>
                    </div>
                    <p className="event-short-description">{event.description}</p>
                    <div className="event-action">
                      {!event.soldout && (
                        <button className="event-buy-button" onClick={() => openModal(event)}>{t('event_card.buy_ticket')}</button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
            </div>
          </>
        )}
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
