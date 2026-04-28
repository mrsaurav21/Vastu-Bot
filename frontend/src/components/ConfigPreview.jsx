import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float, PresentationControls, ContactShadows } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

const ConfigPreview = () => {
  const navigate = useNavigate();

  const handleRedirection = () => {
    // Navigates to the configurator route within your app
    navigate('/configurator');
    
    // If you prefer opening in a new tab as before, use:
    // window.open('/configurator', '_blank');
  };

  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#0a0a0a] px-[5%] py-20 border-t border-white/5 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 w-full max-w-7xl">
        
        {/* --- Left Side: 3D Visual Area --- */}
        <div className="h-[50vh] md:h-[60vh] cursor-grab relative">
          {/* Subtle radial glow behind the 3D object */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
          
          <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 1.5, 6], fov: 35 }}>
            <Suspense fallback={null}>
              <Stage environment="city" intensity={0.4} contactShadow={false}>
                <PresentationControls
                  global
                  zoom={0.8}
                  polar={[-0.1, Math.PI / 4]}
                >
                  <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
                    <group rotation={[0, -Math.PI / 3, 0]}>
                      {/* Dark Sleek Table Top */}
                      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
                        <boxGeometry args={[3, 0.15, 1.8]} />
                        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.9} />
                      </mesh>
                      
                      {/* High-Contrast Legs */}
                      {[[-1.3, -0.9], [1.3, -0.9], [-1.3, 0.9], [1.3, 0.9]].map((pos, index) => (
                        <mesh key={index} position={[pos[0], 0.45, pos[1]]} castShadow>
                          <cylinderGeometry args={[0.04, 0.04, 0.9, 16]} />
                          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
                        </mesh>
                      ))}
                    </group>
                  </Float>
                </PresentationControls>
              </Stage>
              
              <ContactShadows 
                position={[0, -0.5, 0]} 
                opacity={0.7} 
                scale={10} 
                blur={2.5} 
                far={1.2} 
                color="#000000"
              />
            </Suspense>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2.5} />
          </Canvas>
        </div>

        {/* --- Right Side: Content Area --- */}
        <div className="flex items-center">
          <div className="max-w-lg">
            <span className="block text-[#c9a063] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              Featured Tool
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tighter mb-6">
              Ishan 3D Studio
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-10">
              Intuitive configuration. Infinite possibilities. Design and visualize 
              your perfect furniture piece before it leaves the workshop.
            </p>
            
            <button 
              className="group flex items-center gap-4 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all duration-300 hover:-translate-y-1 shadow-xl shadow-white/5"
              onClick={handleRedirection}
            >
              Configure Now
              <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ConfigPreview;