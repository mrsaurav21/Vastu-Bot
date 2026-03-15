import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';
import { convertBlueprintTo3D } from '../services/api';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
        const data = await convertBlueprintTo3D(base64Image);

        // --- THE UPDATED LOGIC ---
        if (data.status === 'success') {
          navigate('/editor', { state: { walls: data.walls } });
        } else if (data.status === 'empty') {
          setError("AI detected the image but couldn't find clear walls. Use a higher contrast blueprint.");
        } else {
          setError(data.message || "Unexpected response from the AI engine.");
        }
      } catch (err) {
        setError("Failed to connect to the AI server. Ensure your FastAPI backend is running.");
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
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
          AI Interior Designer
        </h1>
        <p className="text-gray-400 mb-12 text-lg md:text-xl">
          Upload your 2D floor plan and let our AI instantly generate a 3D explorable room.
        </p>

        <div className="relative group mx-auto max-w-xl">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative bg-[#1a1a1a] border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-2xl p-16 flex flex-col items-center justify-center transition-colors">
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {isLoading ? (
              <div className="flex flex-col items-center text-blue-400">
                <Loader2 className="w-16 h-16 animate-spin mb-4" />
                <p className="text-lg font-semibold tracking-widest uppercase">Processing Blueprint...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-300">
                <UploadCloud className="w-20 h-20 mb-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <p className="text-2xl font-semibold mb-2">Click or drag blueprint here</p>
                <p className="text-gray-500">Supports PNG, JPG, JPEG</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-8 flex items-center justify-center space-x-2 text-red-400 bg-red-400/10 py-3 px-6 rounded-lg max-w-xl mx-auto border border-red-400/20">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-left">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;