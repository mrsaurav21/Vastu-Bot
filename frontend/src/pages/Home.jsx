import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { convertBlueprintTo3D } from '../services/api';
import useDesignStore from './store/useDesignStore';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Get user info and setWalls action from the store
  const { user, setWalls } = useDesignStore();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setError(null);
    const reader = new FileReader();
    
    reader.onloadstart = () => setIsLoading(true);

    reader.onloadend = async () => {
      try {
        const base64Image = reader.result;
        
        // Pass the user's email if logged in, otherwise it defaults to "guest"
        const userEmail = user?.email || "guest";
        
        const data = await convertBlueprintTo3D(base64Image, userEmail);

        if (data.status === 'success') {
          // Update global state so Editor.jsx can access it
          setWalls(data.walls);
          
          // Navigate to editor and pass walls in state as a fallback
          navigate('/editor', { state: { walls: data.walls } });
        } else if (data.status === 'empty') {
          setError("AI detected the image but couldn't find clear walls. Please use a high-contrast blueprint with black lines.");
        } else {
          setError(data.message || "Unexpected response from the Vastu-Bot engine.");
        }
      } catch (err) {
        setError("Connection failed. Ensure the Vastu-Bot backend is running and MongoDB is connected.");
      } finally {
        setIsLoading(false);
        event.target.value = null; 
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center">
        
        <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full mb-6 text-orange-400">
          <Sparkles size={16} />
          <span className="text-xs font-bold tracking-[0.2em] uppercase">Powered by AI Vision</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
          VASTU-BOT
        </h1>
        
        <p className="text-gray-400 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Transform your 2D blueprints into <span className="text-orange-500 font-semibold">explorable 3D environments</span>. Simply upload and start designing.
        </p>

        <div className="relative group mx-auto max-w-xl">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
          
          <div className="relative bg-[#111] border-2 border-dashed border-gray-800 group-hover:border-orange-500/50 rounded-3xl p-12 md:p-20 flex flex-col items-center justify-center transition-all">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-orange-500 mb-6" />
                  <div className="absolute inset-0 blur-xl bg-orange-500/20 animate-pulse"></div>
                </div>
                <p className="text-lg font-bold tracking-[0.3em] text-white uppercase animate-pulse">Analyzing Space...</p>
                <p className="text-xs text-gray-500 mt-2 tracking-widest">Generating 3D Coordinates</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800 group-hover:scale-110 group-hover:border-orange-500/30 transition-all duration-500">
                  <UploadCloud className="w-10 h-10 text-gray-500 group-hover:text-orange-500 transition-colors" />
                </div>
                <p className="text-xl font-bold mb-2 tracking-tight">Drop blueprint here</p>
                <p className="text-gray-500 text-sm">PNG or JPG up to 10MB</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-8 flex items-center justify-center space-x-3 text-red-400 bg-red-400/5 py-4 px-6 rounded-2xl max-w-xl mx-auto border border-red-400/20 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;