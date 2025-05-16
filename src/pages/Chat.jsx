import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import { getLLMResponse, isCrisisMessage } from '../services/chatService'; 

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatMessagesRef = useRef(null); // Create a ref for the chat messages container
  const TYPING_SPEED_MS = 100; // Milliseconds per word
  const THINKING_DELAY_MS = 500; // Reduced thinking delay

  useEffect(() => {
    const nickname = localStorage.getItem('catbirdNickname');
    const greetingName = nickname ? nickname : 'there';
    const initialMessageId = 'initial-greeting';
    const fullGreeting = `Hi ${greetingName}. I’m here to support you. How are you feeling today?`;

    // Set an empty message first, then type it out
    setMessages([{ id: initialMessageId, sender: 'bot', text: '' }]);
    
    // Start typing after a short delay to allow component to mount and be visible
    const initialTypingTimer = setTimeout(() => {
      typeOutMessage(fullGreeting, initialMessageId);
    }, 300); // Short delay before initial greeting starts typing

    return () => clearTimeout(initialTypingTimer); // Cleanup timer on unmount
  }, []); // Empty dependency array means this runs once on mount

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]); // Dependency array includes messages

  const typeOutMessage = (fullText, messageId) => {
    return new Promise((resolve) => {
      const words = fullText.split(' '); 
      let currentText = '';
      let wordIndex = 0;

      function typeNextWord() {
        if (wordIndex < words.length) {
          currentText += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              msg.id === messageId ? { ...msg, text: currentText } : msg
            )
          );

          // Ensure DOM is updated before trying to get the element
          requestAnimationFrame(() => {
            // Scroll to bottom after reflow attempt (now just scrolling)
            if (chatMessagesRef.current) {
              chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
            }
          });

          wordIndex++;
          setTimeout(typeNextWord, TYPING_SPEED_MS);
        } else {
          resolve(); 
        }
      }
      typeNextWord();
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = input;
    setInput('');

    if (isCrisisMessage(currentInput)) {
      const crisisReply = {
        id: Date.now() + '_crisis',
        sender: 'bot',
        text: "I'm really sorry you're feeling this way. You're not alone. Please consider contacting a crisis line or talking to someone you trust.",
      };
      const resources = {
        id: Date.now() + '_resources',
        sender: 'bot',
        text: " **Helpline:** 988 (U.S. Suicide & Crisis Lifeline)\n [Find local help](https://www.opencounseling.com/suicide-hotlines)",
      };
      setMessages(prev => [...prev, crisisReply, resources]);
      return;
    }

    setIsBotTyping(true); // Show typing indicator for thinking/fetching
    const botMessageId = Date.now() + '_bot_response';

    try {
      // Artificial thinking delay
      await new Promise(resolve => setTimeout(resolve, THINKING_DELAY_MS));

      // Now get the response
      const botReply = await getLLMResponse(currentInput);
      
      setIsBotTyping(false); // Hide three-dot indicator before word-by-word typing starts

      // Add a placeholder for the bot's message first, then type it out
      setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: '' }]);
      await typeOutMessage(botReply.text, botMessageId);
    } catch (error) {
      console.error("Error getting LLM response:", error);
      setIsBotTyping(false); // Ensure indicator is off on error
      // Check if botMessageId was added to messages before erroring
      const messageExists = messages.some(msg => msg.id === botMessageId);
      if (messageExists) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, text: "Sorry, I'm having a little trouble connecting. Please try again in a moment." } 
              : msg
          )
        );
      } else {
        // If placeholder wasn't added, add a new error message
        setMessages(prev => [...prev, { id: botMessageId, sender: 'bot', text: "Sorry, I'm having a little trouble connecting. Please try again in a moment." }])
      }
    } 
    // The finally block for setIsBotTyping(false) is removed as it's handled in try (after fetch) and catch.
  };

  return (
    <div className="page-wrapper">
      <div className="chat-container">
        <div className="chat-header">catbird</div>
        <div className="chat-messages" ref={chatMessagesRef}> {/* Assign the ref */}
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-content-wrapper"> 
                {msg.text} 
              </div>
            </div>
          ))}
          {isBotTyping && (
            <div key="typing-indicator" className="chat-message bot typing-indicator">
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