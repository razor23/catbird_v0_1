import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; 
import Nickname from './pages/Nickname'; // Import the Nickname component
import Chat from './pages/Chat';
import About from './pages/About';
import Help from './pages/Help';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/nickname" element={<Nickname />} /> {/* Nickname page route */}
        <Route path="/chat" element={<Chat />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}