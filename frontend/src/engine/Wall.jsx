import React from 'react';

const Wall = ({ start, end }) => {
  // Standard architectural measurements (can be adjusted)
  const height = 3.0;      // 3 meters high
  const thickness = 0.2;   // 20cm thick

  // 1. Calculate the center point (Midpoint formula)
  // The 2D image 'y' axis translates to the 3D 'z' axis (depth)
  const midX = (start.x + end.x) / 2;
  const midZ = (start.y + end.y) / 2; 

  // 2. Calculate the length of the wall (Distance formula)
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // 3. Calculate the rotation angle
  // Negative atan2 is used because Three.js Y-axis rotation goes counter-clockwise
  const angle = -Math.atan2(dy, dx);

  return (
    <mesh 
      position={[midX, height / 2, midZ]} 
      rotation={[0, angle, 0]}
      castShadow 
      receiveShadow
    >
      {/* The box geometry shapes the wall */}
      <boxGeometry args={[length, height, thickness]} />
      
      {/* The material gives it a matte, realistic finish */}
      <meshStandardMaterial 
        color="#e5e7eb" // Light gray to contrast with the dark theme Canvas
        roughness={0.9} 
        metalness={0.0} 
      />
    </mesh>
  );
};

export default Wall;