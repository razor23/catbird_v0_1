import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Landing from './pages/Landing'; 
import Nickname from './pages/Nickname'; // Import the Nickname component
import Chat from './pages/Chat';
import About from './pages/About';
import Help from './pages/Help';

function AppContent() {
  const location = useLocation();
  const nodeRef = useRef(null); // Create a ref for the CSSTransition node

  return (
    <TransitionGroup className="transition-group-wrapper"> 
      <CSSTransition 
        key={location.pathname} 
        nodeRef={nodeRef} // Pass the ref to CSSTransition
        timeout={250} 
        classNames="page-transition" 
        unmountOnExit // Remove component from DOM when exited
      >
        {/* This div will receive the transition classes */}
        <div ref={nodeRef}> {/* Attach the ref to this div */}
          <Routes location={location}> 
            <Route path="/" element={<Landing />} /> 
            <Route path="/nickname" element={<Nickname />} />
            <Route path="/chat" element={<Chat />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}