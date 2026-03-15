import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Box, User, Hexagon, LogOut } from 'lucide-react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import useDesignStore from '../pages/store/useDesignStore';
import { loginWithGoogle } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, setUser, logout } = useDesignStore();

  const isActive = (path) => location.pathname === path;

  // Handle successful Google Login
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const result = await loginWithGoogle(credentialResponse.credential);
      if (result.status === "success") {
        setUser(result.user); // Save to Zustand store
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    logout();
  };

  return (
    <nav className="h-16 bg-[#121212] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/20 group-hover:scale-105 transition-transform">
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-widest text-gray-100 group-hover:text-white transition-colors">
          VASTU-BOT
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-2 md:space-x-6">
        <Link 
          to="/" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive('/') ? 'text-orange-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider hidden md:block">HOME</span>
        </Link>

        <Link 
          to="/editor" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive('/editor') ? 'text-orange-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider hidden md:block">EDITOR</span>
        </Link>

        {isAuthenticated && (
          <Link 
            to="/profile" 
            className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
              isActive('/profile') ? 'text-orange-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wider hidden md:block">PROFILE</span>
          </Link>
        )}

        {/* Auth Section */}
        <div className="pl-4 border-l border-gray-800 ml-2">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <img 
                src={user.picture} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-orange-500/50"
              />
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="scale-90 origin-right">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                useOneTap
                theme="filled_black"
                shape="pill"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;