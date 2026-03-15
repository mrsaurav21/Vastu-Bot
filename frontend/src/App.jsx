import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Import Components
import Navbar from './components/Navbar';

// Import Pages
import Home from './pages/Home';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

// Access the Client ID from your .env file
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App = () => {
  return (
    /**
     * Updated Provider: 
     * We keep the configuration clean here. 
     * Note: Ensure your Google Cloud Console has http://localhost:5173 
     * in the "Authorized JavaScript Origins".
     */
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans overflow-x-hidden">
          
          <Routes>
            {/* Pages with Navbar */}
            <Route path="/" element={
              <>
                <Navbar />
                <Home />
              </>
            } />
            
            <Route path="/profile" element={
              <>
                <Navbar />
                <Profile />
              </>
            } />
            
            {/* Full-screen Editor:
              To fix the THREE.js "NaN" error, we must ensure the Editor 
              always has a clean state if the user refreshes.
            */}
            <Route path="/editor" element={<Editor />} />
            
            {/* Catch-all route for 404 Not Found */}
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
    </GoogleOAuthProvider>
  );
};

export default App;