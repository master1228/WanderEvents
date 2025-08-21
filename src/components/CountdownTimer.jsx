import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/fonts/moscow2024.css';
import '../styles/CountdownTimer.scss';

const CountdownTimer = ({ targetDate, isVisible = true, title = null }) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!targetDate || !isVisible) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, isVisible]);

  if (!isVisible) return null;

  // Временная дата для демонстрации (31 августа 2024)
  const demoTargetDate = targetDate || '2024-08-31T18:00:00';
  const demoDifference = new Date(demoTargetDate) - new Date();
  const demoHours = Math.floor(demoDifference / (1000 * 60 * 60));

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`dynamic-island ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={handleToggleExpanded}
    >
      <div className="island-content">
        {/* Компактный режим - LIVE + цифры */}
        <div className="compact-timer">
          <span className="live-indicator">LIVE</span>
          <span className="moscow2024-font">
            {String(timeLeft.days).padStart(2, '0')}:
            {String(timeLeft.hours).padStart(2, '0')}:
            {String(timeLeft.minutes).padStart(2, '0')}:
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
        </div>

        {/* Расширенный режим */}
        <div className={`expanded-content ${isExpanded ? 'visible' : 'hidden'}`}>
          <div className="expanded-timer">
            <div className="timer-section">
              <div className="timer-number moscow2024-font">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="timer-label">
                {t('countdown.days', { defaultValue: 'ДНЕЙ' })}
              </div>
            </div>
            
            <div className="timer-separator moscow2024-font">:</div>
            
            <div className="timer-section">
              <div className="timer-number moscow2024-font">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="timer-label">
                {t('countdown.hours', { defaultValue: 'ЧАСОВ' })}
              </div>
            </div>
            
            <div className="timer-separator moscow2024-font">:</div>
            
            <div className="timer-section">
              <div className="timer-number moscow2024-font">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="timer-label">
                {t('countdown.minutes', { defaultValue: 'МИНУТ' })}
              </div>
            </div>
            
            <div className="timer-separator moscow2024-font">:</div>
            
            <div className="timer-section">
              <div className="timer-number moscow2024-font">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="timer-label">
                {t('countdown.seconds', { defaultValue: 'СЕКУНД' })}
              </div>
            </div>
          </div>

          {/* Заголовок под таймером */}
          <div className="expanded-title">
            {title || t('countdown.next_event', { defaultValue: 'ДО СЛЕДУЮЩЕГО СОБЫТИЯ' })}
          </div>

          {/* Демо режим в расширенном виде */}
          {!targetDate && (
            <div className="demo-info">
              <div className="demo-hours moscow2024-font">
                {demoHours > 0 ? demoHours : 0}
              </div>
              <div className="demo-text">
                {t('countdown.hours_until_event', { defaultValue: 'ЧАСОВ ДО СОБЫТИЯ' })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
