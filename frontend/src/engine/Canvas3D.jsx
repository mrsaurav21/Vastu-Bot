import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  KeyboardControls, 
  PointerLockControls, 
  MapControls,
  Grid, 
  Environment, 
  ContactShadows 
} from '@react-three/drei';

import Wall from './Wall';
import Movement from './Movement';

const Canvas3D = ({ walls = [] }) => {
  const [viewMode, setViewMode] = useState('walk'); // 'walk' or 'top'

  // Standard movement keys
  const map = [
    { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
    { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
    { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
    { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
  ];

  return (
    <div className="w-full h-full bg-[#121212] relative">
      
      {/* --- View Toggle UI --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-[#1a1a1a]/80 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-2xl">
        <button 
          onClick={() => setViewMode('walk')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${viewMode === 'walk' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          First Person
        </button>
        <button 
          onClick={() => setViewMode('top')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${viewMode === 'top' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
        >
          Top View
        </button>
      </div>

      <KeyboardControls map={map}>
        <Canvas 
          camera={{ 
            position: viewMode === 'walk' ? [0, 2, 5] : [0, 20, 0], 
            fov: viewMode === 'walk' ? 60 : 40 
          }} 
          shadows
        >
          <color attach="background" args={['#0a0a0a']} />
          <ambientLight intensity={0.6} />
          <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} />

          <Suspense fallback={null}>
            <Environment preset="city" />
            <Grid infiniteGrid fadeDistance={50} sectionColor="#333333" cellColor="#1a1a1a" position={[0, -0.01, 0]} />
            <ContactShadows opacity={0.4} scale={50} blur={2} far={10} />

            {/* --- Walls Group --- */}
            <group>
              {walls.map((wall, index) => (
                <Wall key={index} start={wall.start} end={wall.end} />
              ))}
            </group>

            {/* --- Unified Movement Component --- */}
            <Movement mode={viewMode} />

            {/* --- Control Systems --- */}
            {viewMode === 'walk' ? (
              <PointerLockControls />
            ) : (
              <MapControls 
                makeDefault 
                enableRotate={false} 
                screenSpacePanning={true}
              />
            )}
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* Dynamic Control Legend */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm p-4 rounded-xl text-xs text-gray-300 pointer-events-none border border-white/10 shadow-xl">
        <p className="font-bold text-blue-400 mb-2 uppercase tracking-widest">{viewMode} MODE</p>
        <div className="space-y-1">
          <p>• <span className="text-white">W,A,S,D</span> to Move</p>
          {viewMode === 'walk' ? (
            <>
              <p>• <span className="text-white">CLICK</span> to Lock Mouse</p>
              <p>• <span className="text-white">ESC</span> to Unlock Mouse</p>
            </>
          ) : (
            <>
              <p>• <span className="text-white">RIGHT CLICK</span> to Pan</p>
              <p>• <span className="text-white">SCROLL</span> to Zoom</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas3D;