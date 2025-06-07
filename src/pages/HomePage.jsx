import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import '../styles/HomePage.scss';
import TicketModal from '../components/TicketModal';
import { fetchEvents, getStrapiBaseUrl } from '../utils/api';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true); 
      try {
        const data = await fetchEvents();

        if (data && Array.isArray(data.data)) {
          const formatted = data.data.map((item, index) => {

            const strapiBaseUrl = getStrapiBaseUrl();
            const imageUrl = item.image && (item.image.url || item.image.formats?.thumbnail?.url)
              ? `${strapiBaseUrl}${item.image.url || item.image.formats.thumbnail.url}`
              : '';
            
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
              sold_out: false 
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
  }, []);

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
            <div className="scroll-text">листай дальше</div>
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
            <p className="loading-text">Загрузка</p>
          </div>
        )}
        {!loading && (
          <div id="events" className="events-list">
            {events.map((event, index) => (
              <div className="event-card" key={index}>
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
