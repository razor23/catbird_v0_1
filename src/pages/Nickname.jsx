import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Nickname.css'; // Styles for this component

export default function Nickname() {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setNickname(event.target.value);
  };

  const handleSubmit = () => {
    if (nickname.trim()) {
      localStorage.setItem('catbirdNickname', nickname.trim()); // Store nickname
      console.log('Nickname chosen:', nickname);
      navigate('/chat');
    } else {
      // Optional: Show an error or prompt if nickname is empty
      alert('Please choose a nickname.');
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="page-wrapper nickname-page-wrapper"> {/* Reuse page-wrapper from Landing/Chat */} 
      <div className="content-box nickname-content-box"> {/* Reuse content-box */} 
        <div className="nickname-container">
          <div className="header-text">
            <h1>Hey! I'm <span className="catbird-name">catbird</span></h1>
            <p>Our conversations are private & anonymous, so there is no login. Just choose a nickname and we're good to go.</p>
          </div>

          <div className="nickname-input-area">
            <div className="catbird-peek">
              <img src="/assets/Catbird-removebg-preview.png" alt="Catbird Mascot" className="logo-small" />
            </div>
            <input 
              type="text"
              value={nickname}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Choose a nickname..."
              className="nickname-input"
              aria-label="Choose a nickname"
            />
            {/* Simple proceed button, can be styled better or removed if Enter is preferred */}
            {nickname.trim() && (
                 <button onClick={handleSubmit} className="proceed-nickname-button" aria-label="Proceed with nickname">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="13 17 18 12 13 7"></polyline>
                        <polyline points="6 17 11 12 6 7"></polyline>
                    </svg>
                </button>
            )}
          </div>

          <div className="terms-text">
            <p>
              By continuing, I confirm I am 18 or older and accept the 
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and 
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
