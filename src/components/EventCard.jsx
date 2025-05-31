import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import '../styles/EventCard.scss';

const EventCard = ({ event }) => {
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
            <span>{date}</span>
          </div>
          
          <div className="event-card__detail">
            <FaMapMarkerAlt className="event-card__icon" />
            <span>{location}</span>
          </div>
          
          <div className="event-card__detail">
            <FaUserFriends className="event-card__icon" />
            <span>{attendees} attendees</span>
          </div>
        </div>
        
        <div className="event-card__footer">
          <span className="event-card__price">{price ? `$${price}` : 'Free'}</span>
          <Link to={`/events/${id}`} className="event-card__button">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
