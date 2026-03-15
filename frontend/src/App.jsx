import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      {/* The main wrapper for the entire application.
        We set a dark background globally to prevent white flashes during navigation.
      */}
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-x-hidden">
        
        {/* Global Navigation Bar */}
        <Navbar />

        {/* Main content area. 
          flex-1 ensures it takes up all remaining space below the Navbar.
        */}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Catch-all route for 404 Not Found */}
            <Route 
              path="*" 
              element={
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <h2 className="text-2xl tracking-widest">404 | PAGE NOT FOUND</h2>
                </div>
              } 
            />
          </Routes>
        </main>
        
      </div>
    </Router>
  );
};

export default App;