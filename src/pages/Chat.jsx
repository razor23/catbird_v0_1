import React, { useState } from 'react';
import { getLLMResponse } from '../services/chatService';
import './Chat.css';

export default function Chat() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi there. I’m here to support you. How are you feeling today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input };
    setMessages([...messages, newMessage]);
    setInput('');

    const botReply = await getLLMResponse(input);
    setMessages(prev => [...prev, { sender: 'bot', text: botReply.text }]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
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
  );
}