import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { fetchVideo, fetchAbout } from '../utils/api';
import '../styles/HomePage.scss';
import '../styles/LandingPage.scss';

// Helper function to convert Strapi's Rich Text JSON to HTML
const convertStrapiRichTextToHtml = (blocks) => {
  if (!Array.isArray(blocks)) {
    return blocks; // Return as is if it's not an array (e.g., plain text)
  }
  return blocks.map(block => {
    const innerHtml = block.children.map(child => {
      let text = child.text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      if (child.bold) text = `<strong>${text}</strong>`;
      if (child.italic) text = `<em>${text}</em>`;
      if (child.underline) text = `<u>${text}</u>`;
      if (child.strikethrough) text = `<s>${text}</s>`;
      return text;
    }).join('');

    switch (block.type) {
      case 'paragraph':
        return `<p>${innerHtml}</p>`;
      case 'heading':
        return `<h${block.level}>${innerHtml}</h${block.level}>`;
      default:
        return `<p>${innerHtml}</p>`;
    }
  }).join('');
};

const LandingPage = () => {
  const { t } = useTranslation();
  const { locale } = useLanguage();
  const [videoUrl, setVideoUrl] = useState('');
  const [aboutText, setAboutText] = useState('');

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await fetchVideo(locale);
        // Single Type возвращает объект, а не массив
        if (response && response.data && typeof response.data === 'object') {
          const videoEntry = response.data;
          const attributes = videoEntry.attributes || videoEntry;
          const rawUrl = attributes.url;
          if (rawUrl) {
            let videoId;
            if (rawUrl.includes('youtu.be/')) {
              videoId = rawUrl.split('youtu.be/')[1];
            } else if (rawUrl.includes('v=')) {
              videoId = rawUrl.split('v=')[1];
            } else {
              throw new Error(`Invalid YouTube URL format: ${rawUrl}`);
            }
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
              videoId = videoId.substring(0, ampersandPosition);
            }
            setVideoUrl(`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3&fs=0`);
          } else {
            throw new Error("Video entry found in Strapi, but the 'url' field is empty or missing.");
          }
        } else {
          console.warn('No video found from API. Is the video entry published in Strapi? Using default fallback video.');
          setVideoUrl('https://www.youtube.com/embed/3W9S1fP5DWg?modestbranding=1&rel=0&iv_load_policy=3&fs=0');
        }
      } catch (error) {
        console.error('Failed to fetch and process video URL:', error);
        setVideoUrl('https://www.youtube.com/embed/3W9S1fP5DWg?modestbranding=1&rel=0&iv_load_policy=3&fs=0');
      }
    };
    getVideo();
  }, [locale]);

  useEffect(() => {
    const getAbout = async () => {
      try {
        const response = await fetchAbout(locale);
        // Single Type возвращает объект, а не массив
        if (response && response.data && typeof response.data === 'object') {
          const entry = response.data;
          const attributes = entry.attributes || entry;
          if (attributes.txt) {
            const html = convertStrapiRichTextToHtml(attributes.txt);
            setAboutText(html);
          } else {
             throw new Error("About entry found, but 'txt' field is missing.");
          }
        } else {
          console.warn('No about text found from API. Is the entry published in Strapi?');
          setAboutText('<p>About text not found.</p>');
        }
      } catch (error) {
        console.error('Failed to fetch about text:', error);
        setAboutText('<p>Error loading content.</p>');
      }
    };
    getAbout();
  }, [locale]);

  return (
    <div className="home-page">
      <div className="landing-page-container">
        <h1 className="landing-page-title">{t('about_us_page.title')}</h1>
        <div className="landing-page-text" dangerouslySetInnerHTML={{ __html: aboutText }} />
      </div>

      <div className="media-section">
        <h2 className="media-section-title">{t('ticket_modal.our_moments')}</h2>
        <div className="media-content">
          <div className="media-video-container">
            {videoUrl && <iframe
              className="media-item"
              src={videoUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
