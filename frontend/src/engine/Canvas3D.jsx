import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  KeyboardControls, 
  OrbitControls, 
  PointerLockControls,
  Center,
} from '@react-three/drei';

// Components
import Wall from './Wall';
import Movement from './Movement';
import Furniture from './Furniture';

// Store
import useDesignStore from '../pages/store/useDesignStore';

const Canvas3D = ({ walls = [] }) => {
  const [viewMode, setViewMode] = useState('top');
  
  // Pull furniture and selection actions from store
  const { furniture, setActiveItem } = useDesignStore();

  /**
   * UNIFIED KEYBOARD MAP
   * WASD: Horizontal floor sliding
   * Arrows: Vertical altitude adjustment
   */
  const keyMap = [
    { name: 'forward', keys: ['w', 'W'] },
    { name: 'backward', keys: ['s', 'S'] },
    { name: 'left', keys: ['a', 'A'] },
    { name: 'right', keys: ['d', 'D'] },
    { name: 'up', keys: ['ArrowUp'] },
    { name: 'down', keys: ['ArrowDown'] },
  ];

  return (
    <div className="w-full h-full bg-black relative">
      
      {/* --- View Mode Toggle --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex bg-zinc-900/90 backdrop-blur-xl p-1 rounded-full border border-white/10 shadow-2xl">
        <button 
          onClick={() => setViewMode('walk')} 
          className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            viewMode === 'walk' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-500 hover:text-white'
          }`}
        >
          1ST PERSON
        </button>
        <button 
          onClick={() => setViewMode('top')} 
          className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 ${
            viewMode === 'top' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/40' : 'text-gray-500 hover:text-white'
          }`}
        >
          TOP VIEW
        </button>
      </div>

      <KeyboardControls map={keyMap}>
        <Canvas 
          shadows 
          camera={{ 
            position: viewMode === 'walk' ? [0, 2, 10] : [0, 80, 0], 
            fov: 45 
          }}
        >
          {/* --- 1. BLACK NIGHT BACKGROUND --- */}
          <color attach="background" args={['#000000']} />
          
          {/* --- 2. ENHANCED LIGHTING FOR COLOR --- */}
          <ambientLight intensity={0.4} />
          <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#333333" />
          
          <pointLight position={[20, 30, 10]} intensity={1.5} castShadow />
          <directionalLight 
            position={[-10, 20, 10]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />

          <Suspense fallback={null}>
            {/* --- 3. WHITE FLOOR PLATFORM --- */}
            <mesh 
              rotation={[-Math.PI / 2, 0, 0]} 
              position={[0, -0.05, 0]} 
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                setActiveItem(null); 
              }}
            >
              <planeGeometry args={[350, 350]} />
              <meshStandardMaterial 
                color="#ffffff" 
                roughness={1} 
                metalness={0} 
              />
            </mesh>

            {/* --- 4. 3D ARCHITECTURE & ASSETS --- */}
            <group>
              {/* CENTER COMPONENT ONLY WRAPS WALLS */}
              <Center top> 
                <group>
                  {walls.map((wall, index) => (
                    <Wall key={`wall-${index}`} data={wall} /> 
                  ))}
                </group>
              </Center>

              {/* FURNITURE IS OUTSIDE CENTER SO IT CAN BE MOVED MANUALLY */}
              {furniture.map((item) => (
                <Furniture key={item.id} data={item} />
              ))}
            </group>

            {/* --- 5. NAVIGATION SYSTEMS --- */}
            <Movement mode={viewMode} />

            {viewMode === 'top' ? (
              <OrbitControls 
                makeDefault 
                enableRotate={true} 
                screenSpacePanning={true} 
              />
            ) : (
              <PointerLockControls />
            )}
          </Suspense>
        </Canvas>
      </KeyboardControls>

      {/* --- UI Legend (Dark Mode) --- */}
      <div className="absolute bottom-6 left-6 bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-white/5 pointer-events-none select-none shadow-2xl">
        <p className="text-orange-500 text-[10px] font-black tracking-widest mb-2 uppercase">
          Vastu-Bot Control Suite
        </p>
        <div className="text-[9px] text-gray-400 space-y-2 uppercase tracking-wider font-bold">
          <p>• <span className="text-white">W A S D</span> — SLIDE CAMERA</p>
          <p>• <span className="text-white">↑ / ↓</span> — CHANGE ALTITUDE</p>
          <p>• <span className="text-white">SCROLL</span> — ZOOM VIEW</p>
          <p className="pt-2 border-t border-white/5 mt-2">
            • <span className="text-white">CLICK ITEM</span> — SELECT / TOGGLE MODE
          </p>
          <p>• <span className="text-white">DEL</span> — REMOVE SELECTED</p>
        </div>
      </div>
    </div>
  );
};

export default Canvas3D;