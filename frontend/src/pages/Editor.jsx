import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Box } from 'lucide-react';

// We will create this 3D component next
import Canvas3D from '../engine/Canvas3D'; 

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve the walls data passed from Home.jsx
  const walls = location.state?.walls || [];

  // If no walls are present (e.g., user navigated here directly without uploading), redirect
  if (walls.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-xl mb-6">No blueprint data found.</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold tracking-wider transition-colors"
        >
          Go back to Upload
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex overflow-hidden text-white font-sans">
      
      {/* Main 3D Viewport Area */}
      <div className="flex-1 relative flex flex-col">
        
        {/* Top Navigation Bar */}
        <div className="h-16 bg-[#121212] border-b border-gray-800 flex items-center px-6 justify-between z-10 shadow-md">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              title="Back to Upload"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5 text-blue-400" />
              <h1 className="text-xl font-bold tracking-widest text-gray-100">
                3D WORKSPACE
              </h1>
            </div>
          </div>
          
          {/* Stats / Status */}
          <div className="flex items-center space-x-4 text-sm bg-gray-900 px-4 py-1.5 rounded-full border border-gray-800">
            <span className="text-gray-400">Walls Generated:</span>
            <span className="text-blue-400 font-bold">{walls.length}</span>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="flex-1 w-full h-full relative cursor-crosshair">
          <Canvas3D walls={walls} />
        </div>
      </div>

      {/* Sidebar - Placeholder for Phase 2 (Furniture & Materials) */}
      <div className="w-80 bg-[#121212] border-l border-gray-800 flex flex-col z-10 shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-sm font-bold tracking-widest text-gray-400 mb-1">CATALOGUE</h2>
          <p className="text-xs text-blue-400">Furniture coming in Phase 2</p>
        </div>
        
        {/* Asset List Placeholder */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="border border-dashed border-gray-700 bg-gray-900/50 rounded-xl h-24 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors">
            <p className="text-sm">Drag & Drop models</p>
          </div>
          <div className="border border-dashed border-gray-700 bg-gray-900/50 rounded-xl h-24 flex items-center justify-center text-gray-600 hover:border-gray-500 transition-colors"></div>
        </div>
        
        {/* Save Button */}
        <div className="p-6 border-t border-gray-800 bg-[#0a0a0a]">
          <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold tracking-widest transition-all shadow-lg shadow-blue-900/20">
            SAVE DESIGN
          </button>
        </div>
      </div>

    </div>
  );
};

export default Editor;