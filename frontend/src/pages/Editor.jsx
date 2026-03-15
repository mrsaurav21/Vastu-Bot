import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Box, 
  AlertCircle, 
  Save, 
  Layers, 
  ChevronLeft,
  Trash2,
  Move,
  RotateCcw
} from 'lucide-react';
import useDesignStore from './store/useDesignStore';
import Canvas3D from '../engine/Canvas3D';

// --- IMPORT YOUR EXTERNAL CATALOGUE DATA ---
import { ASSET_CATALOGUE } from '../data/catalogue';

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Zustand Store Actions & State
  const { 
    walls, 
    setWalls, 
    furniture,
    user, 
    isAuthenticated, 
    addFurniture, 
    editMode, 
    setEditMode, 
    clearFurniture,
    activeItem,
    setActiveItem,
    removeFurniture
  } = useDesignStore();

  // Sidebar UI State
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    // Priority 1: Walls passed from Home.jsx/Profile.jsx via state
    const navWalls = location.state?.walls || location.state?.initialWalls;
    
    if (navWalls && navWalls.length > 0) {
      setWalls(navWalls);
    }
  }, [location.state, setWalls]);

  // --- THE REAL DATABASE SAVE FUNCTION ---
  const handleSave = async () => {
    if (!isAuthenticated || !user?.email) {
      alert("Please login with Google to save your designs to your profile!");
      return;
    }
    
    try {
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const projectName = `DESIGN-${randomId}`;

      const response = await fetch("http://localhost:8000/projects/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: user.email,
          walls: walls,
          project_name: projectName
        })
      });

      if (response.ok) {
        alert(`Success! ${projectName} has been saved to your profile.`);
      } else {
        alert("Failed to save design. Please check if the backend server is running.");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Network error. Could not reach the server to save the design.");
    }
  };

  // --- HANDLE ADDING ITEM TO 3D ROOM ---
  const handleAddItem = (item) => {
    console.log("Spawning item:", item.name);
    addFurniture(item);
  };

  // Error state: Show this if no blueprint data is found
  if (walls.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-orange-500 mb-4 animate-pulse" />
        <h2 className="text-2xl font-black tracking-tighter mb-2">WORKSPACE EMPTY</h2>
        <p className="text-gray-500 max-w-xs mb-8">
          No blueprint data was detected. Please return to the home page and upload a floor plan image.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-orange-600 hover:bg-orange-500 rounded-xl font-bold tracking-widest transition-all shadow-lg shadow-orange-900/40 active:scale-95"
        >
          GO TO UPLOAD
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
              title="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Box className="w-5 h-5 text-orange-500" />
              <h1 className="text-xl font-bold tracking-widest text-gray-100">
                VASTU-BOT <span className="text-gray-600 font-light ml-2 hidden md:inline">| 3D ENGINE</span>
              </h1>
            </div>

            {/* --- OBJECT EDIT MODE TOGGLE --- */}
            <div className="flex bg-zinc-900/90 backdrop-blur-xl p-1 rounded-full border border-white/10 ml-4">
              <button 
                onClick={() => setEditMode('move')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${editMode === 'move' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
              >
                <Move className="w-3 h-3" />
                <span>MOVE</span>
              </button>
              <button 
                onClick={() => setEditMode('rotate')}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${editMode === 'rotate' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-500 hover:text-white'}`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>ROTATE</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm bg-gray-900 px-4 py-1.5 rounded-full border border-gray-800">
            <Layers className="w-4 h-4 text-orange-500" />
            <span className="text-gray-400 hidden sm:inline">Structural Walls:</span>
            <span className="text-orange-400 font-bold">{walls.length}</span>
          </div>
        </div>

        {/* 3D Canvas Container */}
        <div className="flex-1 w-full h-full relative cursor-crosshair bg-gradient-to-b from-[#0a0a0a] to-[#111]">
          <Canvas3D walls={walls} />
        </div>
      </div>

      {/* Sidebar - Catalogue & Controls */}
      <div className="w-80 bg-[#121212] border-l border-gray-800 flex flex-col z-10 shadow-2xl">
        <div className="p-6 border-b border-gray-800 bg-[#151515]">
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-500 mb-1">FURNITURE CATALOGUE</h2>
          <p className="text-[10px] uppercase text-orange-500/80 font-bold">
            {activeCategory ? `Browsing: ${ASSET_CATALOGUE.find(c => c.id === activeCategory)?.name}` : 'Select Category'}
          </p>
        </div>
        
        {/* Dynamic Asset Container */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {!activeCategory ? (
            <div className="flex flex-col space-y-4">
              {ASSET_CATALOGUE.map((category) => {
                const Icon = category.icon;
                return (
                  <button 
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className="flex items-center p-5 bg-[#1a1a1a] border border-gray-800 hover:border-orange-500 rounded-xl transition-all group shadow-lg"
                  >
                    <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mr-4 group-hover:bg-orange-500/10 transition-colors">
                      <Icon className="w-6 h-6 text-gray-500 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-black tracking-widest uppercase text-gray-300 group-hover:text-white">
                        {category.name}
                      </span>
                      <span className="block text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        {category.items.length} Items Available
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <button 
                onClick={() => setActiveCategory(null)}
                className="flex items-center text-[10px] font-bold tracking-widest uppercase text-gray-500 hover:text-orange-500 transition-colors mb-4 pb-2 border-b border-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Categories
              </button>

              {ASSET_CATALOGUE.find(c => c.id === activeCategory)?.items.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => handleAddItem(item)}
                  className="w-full flex items-center p-3 bg-[#1a1a1a] border border-gray-800 hover:border-orange-500 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-900 rounded-lg mr-3 flex items-center justify-center border border-gray-800 group-hover:border-orange-500/50">
                    <Box className="w-4 h-4 text-gray-600 group-hover:text-orange-500" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-[11px] font-bold tracking-wider text-gray-300 group-hover:text-white uppercase leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[8px] text-gray-500 tracking-widest uppercase mt-1">
                      {item.type} • Click to place
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* --- IN-ROOM ASSETS MANAGER --- */}
        <div className="p-6 border-t border-gray-800 bg-[#0c0c0c]">
          <h3 className="text-[10px] font-black tracking-widest text-gray-500 mb-3 uppercase">
            In-Room Assets ({furniture.length})
          </h3>
          <div className="max-h-48 overflow-y-auto space-y-2 mb-4 scrollbar-hide">
            {furniture.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-all ${
                  activeItem === item.id ? 'border-orange-500 bg-orange-500/10' : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <Box className={`w-3 h-3 flex-shrink-0 ${activeItem === item.id ? 'text-orange-500' : 'text-gray-500'}`} />
                  <span className="text-[10px] font-bold uppercase truncate">{item.name}</span>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFurniture(item.id); }}
                  className="p-1 hover:text-red-500 text-gray-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {furniture.length === 0 && (
              <p className="text-[9px] text-gray-600 uppercase text-center py-4 italic border border-dashed border-white/5 rounded-lg">Room is empty</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="space-y-3">
            <button 
              onClick={clearFurniture}
              className="w-full flex items-center justify-center space-x-2 py-3 border border-red-500/30 text-red-500/70 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black tracking-[0.2em] transition-all active:scale-95"
            >
              <Trash2 className="w-3 h-3" />
              <span>DELETE ALL ASSETS</span>
            </button>

            <button 
              onClick={handleSave}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold tracking-widest transition-all shadow-lg shadow-orange-900/30 active:scale-95"
            >
              <Save className="w-5 h-5" />
              <span>SAVE DESIGN</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Editor;