import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import '../styles/EventCard.scss';

const EventCard = ({ event }) => {
  const { t } = useTranslation();
  const { id, title, image, date, location, category, attendees, price } = event;

  return (
    <div className="event-card">
      <div className="event-card__image-container">
        <img src={image} alt={title} className="event-card__image" />
        <span className="event-card__category">{category}</span>
      </div>
      
      <div className="event-card__content">
        <h3 className="event-card__title">{title}</h3>
        
        <div className="event-card__details">
          <div className="event-card__detail">
            <FaCalendarAlt className="event-card__icon" />
            <span>{t('event_card.date')}: {date}</span>
          </div>
          
          <div className="event-card__detail">
            <FaMapMarkerAlt className="event-card__icon" />
            <span>{t('event_card.location')}: {location}</span>
          </div>
          
          <div className="event-card__detail">
            <FaUserFriends className="event-card__icon" />
            <span>{t('event_card.attendees')}: {attendees} attendees</span>
          </div>
        </div>
        
        <div className="event-card__footer">
          <span className="event-card__price">{price ? `$${price}` : t('event_card.free')}</span>
          <Link to={`/events/${id}`} className="event-card__button">
            {t('event_card.view_details')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
