import React from 'react';

const Wall = ({ data }) => {
  if (!data) return null;

  // Extract coordinates directly from the AI data
  const sx = Number(data?.start?.x ?? data?._raw?.x1 ?? 0);
  const sy = Number(data?.start?.y ?? data?._raw?.y1 ?? 0);
  const ex = Number(data?.end?.x   ?? data?._raw?.x2 ?? 0);
  const ey = Number(data?.end?.y   ?? data?._raw?.y2 ?? 0);

  // THE SCALE FIX: 
  // Python already shrunk the numbers. We just use 1.5 to make it look great on our grid.
  const m = 1.5; 
  
  const x1 = sx * m;
  const z1 = sy * m; 
  const x2 = ex * m;
  const z2 = ey * m;

  // MATH
  const midX = (x1 + x2) / 2;
  const midZ = (z1 + z2) / 2; 
  
  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.sqrt(dx * dx + dz * dz);

  // Hide impossible walls
  if (isNaN(length) || length <= 0.1) return null;

  const angle = -Math.atan2(dz, dx);

  return (
    <mesh 
      position={[midX, 1.5, midZ]} 
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, 3, 0.3]} />
      <meshStandardMaterial 
  color="#ffffff" 
  roughness={0.9} // Higher roughness makes it look like flat white paint
  metalness={0} 
/>
    </mesh>
  );
};

export default Wall;