import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // Commented out potentially conflicting styles
import './styles/App.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Установка заголовка страницы
document.title = 'WanderEvents | События';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
