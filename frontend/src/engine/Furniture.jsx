import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

const Furniture = ({ modelPath, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  // Load the 3D model (.glb or .gltf file) from the public folder
  const { scene } = useGLTF(modelPath);

  // We clone the scene so you can place multiple instances of the same furniture 
  // (e.g., 4 of the same chairs) without Three.js throwing an error.
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={clonedScene} 
      position={position} 
      rotation={rotation}
      castShadow
      receiveShadow
    />
  );
};

export default Furniture;