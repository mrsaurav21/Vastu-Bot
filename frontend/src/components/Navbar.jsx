import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Box, User, Hexagon } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="h-16 bg-[#121212] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-50 shadow-md">
      
      {/* Brand / Logo */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
          <Hexagon className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg tracking-widest text-gray-100 group-hover:text-white transition-colors">
          AI DESIGNER
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-2 md:space-x-6">
        <Link 
          to="/" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive('/') ? 'text-blue-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider hidden md:block">HOME</span>
        </Link>

        <Link 
          to="/editor" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive('/editor') ? 'text-blue-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider hidden md:block">EDITOR</span>
        </Link>

        <Link 
          to="/profile" 
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
            isActive('/profile') ? 'text-blue-400 bg-gray-900/50' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-wider hidden md:block">PROFILE</span>
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;