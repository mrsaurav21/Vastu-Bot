import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';

import ConfiguratorCanvas from '../engine/ConfiguratorCanvas';
import ConfigInterface from '../engine/ConfigInterface';

const ConfiguratorPage = () => {
  const navigate = useNavigate();

  return (
    // 'text-black font-normal' blocks the Vastu-Bot dark mode text styles from ruining MUI
    <div className="configurator-body relative w-full h-screen overflow-hidden text-black font-normal">
      
      <Canvas gl={{ antialias: true }} shadows>
        <ConfiguratorCanvas />
      </Canvas>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 px-4 py-2 bg-white/40 backdrop-blur-md text-gray-800 text-xs font-bold rounded-full hover:bg-white/60 transition-all shadow-sm z-50 border border-white/30"
      >
        ← BACK TO VASTU-BOT
      </button>

      <ConfigInterface />

    </div>
  );
};

export default ConfiguratorPage;