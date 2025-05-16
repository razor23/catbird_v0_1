import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css'; // Import the CSS file

export default function Landing() {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/nickname'); // Navigate to the nickname page
  };

  return (
    <div className="page-wrapper"> 
      <div className="content-box"> 
        <div className="landing-container">
          <div className="logo-container">
            {/* Placeholder Catbird SVG - Replace with your actual logo */}
            <svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="logo">
              <defs>
                <linearGradient id="birdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#81D4FA', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#03A9F4', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              {/* Simplified bird shape */}
              <path d="M20,70 C20,40 50,20 80,50 C70,80 40,85 20,70 Z" fill="url(#birdGradient)"/>
              <circle cx="70" cy="40" r="8" fill="#FFFFFF"/>
              <circle cx="72" cy="39" r="3" fill="#263238"/> 
              <path d="M15,65 Q30,55 45,68" stroke="#B0BEC5" strokeWidth="5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Hey! I'm <span className="catbird-name">catbird</span></h1>
          <p className="tagline">Your friendly AI companion, ready to chat and explore ideas.</p>
          <button onClick={handleProceed} className="proceed-button" aria-label="Proceed to chat">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16.5L6 10.5L7.41 9.09L12 13.67L16.59 9.09L18 10.5L12 16.5Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
