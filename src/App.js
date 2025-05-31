import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import Footer from './components/Footer'; // Added Footer component import
import './styles/App.scss';
import backgroundImage from './assets/images/background.png';

function App() {
  return (
    <Router>
      <div id="app-top" className="app" style={{ 
          backgroundColor: '#000000'
        }}>
        <Header />
        <main className="main-content" style={{ backgroundColor: 'transparent', padding: 0 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<HomePage />} />
            <Route path="/contacts" element={<HomePage />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
