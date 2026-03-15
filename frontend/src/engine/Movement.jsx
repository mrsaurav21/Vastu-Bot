import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

const Movement = ({ mode = 'walk' }) => {
  const [, getKeys] = useKeyboardControls();
  const speed = 0.2; // Slightly faster for better feel

  useFrame((state) => {
    const { forward, backward, left, right } = getKeys();
    const { camera } = state;

    // Only run movement logic if a key is actually being pressed
    if (!forward && !backward && !left && !right) return;

    if (mode === 'walk') {
      // --- FIRST PERSON MOVEMENT ---
      // translateZ/X move relative to the camera's current rotation
      const moveZ = (Number(backward) - Number(forward)) * speed;
      const moveX = (Number(right) - Number(left)) * speed;

      camera.translateZ(moveZ);
      camera.translateX(moveX);
      
      // Force the height to stay at eye-level (2 units up from floor)
      camera.position.y = 2; 
    } else {
      // --- TOP VIEW MOVEMENT ---
      // In top view, we move along the global X and Z axis 
      // because the camera is pointed straight down (-Y)
      const moveZ = (Number(backward) - Number(forward)) * speed;
      const moveX = (Number(right) - Number(left)) * speed;

      camera.position.z += moveZ;
      camera.position.x += moveX;
      
      // Ensure the camera stays at "Bird's Eye" height and looks flat down
      camera.position.y = 20; 
      camera.rotation.set(-Math.PI / 2, 0, 0);
    }
  });

  return null;
};

export default Movement;