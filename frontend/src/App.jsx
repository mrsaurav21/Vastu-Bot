import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Editor from './pages/Editor';
import Profile from './pages/Profile';
import ConfiguratorPage from './pages/ConfiguratorPage'; // ✅ Added this import

// Store/Context
import { ConfiguratorProvider } from './pages/store/ConfiguratorContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ConfiguratorProvider>
        <Router>
          <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-x-hidden">
            
            <Routes>
              {/* Home Route */}
              <Route path="/" element={
                <>
                  <Navbar />
                  <Home />
                </>
              } />
              
              {/* Profile Route */}
              <Route path="/profile" element={
                <>
                  <Navbar />
                  <Profile />
                </>
              } />

              {/* Configurator Route */}
              <Route path="/configurator" element={<ConfiguratorPage />} />
              
              {/* Editor Route */}
              <Route path="/editor" element={<Editor />} />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-500 bg-[#0a0a0a]">
                    <h2 className="text-2xl tracking-[0.5em] font-light italic">404 | PAGE NOT FOUND</h2>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="mt-6 text-orange-500 hover:text-orange-400 text-xs tracking-widest font-bold underline transition-all"
                    >
                      RETURN TO VASTU-BOT
                    </button>
                  </div>
                } 
              />
            </Routes>
          </div>
        </Router>
      </ConfiguratorProvider>
    </GoogleOAuthProvider>
  );
};

export default App;