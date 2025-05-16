import React, { useState, useEffect } from 'react';
import { getLLMResponse } from '../services/chatService';
import './Chat.css';
import { isCrisisMessage } from '../services/chatService';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);

  useEffect(() => {
    // Initial bot message
    setMessages([
      { sender: 'bot', text: 'Hi there. I’m here to support you. How are you feeling today?' }
    ]);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    // 👉 Crisis Detection
    if (isCrisisMessage(input)) {
      const crisisReply = {
        sender: 'bot',
        text: "I'm really sorry you're feeling this way. You're not alone. Please consider contacting a crisis line or talking to someone you trust.",
      };
      const resources = {
        sender: 'bot',
        text: " **Helpline:** 988 (U.S. Suicide & Crisis Lifeline)\n [Find local help](https://www.opencounseling.com/suicide-hotlines)",
      };
      setMessages(prev => [...prev, crisisReply, resources]);
    return;
  }

    setIsBotTyping(true);
    try {
      const botReply = await getLLMResponse(input);
      setMessages(prev => [...prev, { sender: 'bot', text: botReply.text }]);
    } catch (error) {
      console.error("Error getting LLM response:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I'm having a little trouble connecting. Please try again in a moment." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="chat-container">
        <div className="chat-header">catbird</div>
        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isBotTyping && (
            <div className="chat-message bot typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={input}
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}