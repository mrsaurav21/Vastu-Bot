import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Settings, LogOut, FolderHeart, Clock, Plus } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulated fetch for Phase 1. 
  // In Phase 2, this will call your FastAPI /projects endpoint.
  useEffect(() => {
    setTimeout(() => {
      setDesigns([]); // Empty for now until Save is implemented
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
      
      {/* Top Navigation */}
      <div className="h-16 bg-[#121212] border-b border-gray-800 flex items-center px-6 justify-between z-10 sticky top-0">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold tracking-wider">BACK TO HOME</span>
        </button>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-red-400 hover:text-red-300 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Left Sidebar - User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-900/20">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold tracking-widest text-gray-100 mb-1">DESIGNER</h2>
            <p className="text-sm text-blue-400 mb-6">Free Tier Plan</p>
            
            <div className="w-full border-t border-gray-800 pt-6 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><FolderHeart className="w-4 h-4 mr-2"/> Saved</span>
                <span className="font-bold text-gray-300">{designs.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><Clock className="w-4 h-4 mr-2"/> Hours</span>
                <span className="font-bold text-gray-300">0.0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content - Saved Designs Grid */}
        <div className="md:col-span-3">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold tracking-widest text-gray-200">MY BLUEPRINTS</h3>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold tracking-wider transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>NEW DESIGN</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((skeleton) => (
                <div key={skeleton} className="h-64 bg-[#121212] border border-gray-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : designs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mapping future designs here */}
              {designs.map((design, index) => (
                <div key={index} className="group h-64 bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500 transition-colors cursor-pointer relative">
                  <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center group-hover:bg-transparent transition-colors">
                    <span className="text-gray-500">Preview</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="font-bold text-white">{design.name || "Untitled Room"}</p>
                    <p className="text-xs text-gray-400">Modified recently</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#121212] border border-dashed border-gray-800 rounded-2xl text-center">
              <FolderHeart className="w-16 h-16 text-gray-700 mb-4" />
              <p className="text-xl font-bold text-gray-400 mb-2">No designs saved yet</p>
              <p className="text-gray-600 max-w-md">
                Upload a floor plan and generate a 3D model to start building your portfolio.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;