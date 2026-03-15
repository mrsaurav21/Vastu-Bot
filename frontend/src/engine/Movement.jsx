import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

// Pre-allocate vectors to prevent garbage collection lag
const moveVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const direction = new THREE.Vector3();

const Movement = ({ mode = 'walk' }) => {
  const [, getKeys] = useKeyboardControls();

  useFrame((state, delta) => {
    const { forward, backward, left, right, up, down } = getKeys();
    const { camera } = state;

    // 1. CALCULATE HORIZONTAL MOVEMENT (WASD)
    // This logic translates camera-facing direction into floor-plane movement
    if (forward || backward || left || right) {
      const speed = mode === 'walk' ? 15 : 50; // Boost speed for top view
      const moveDistance = speed * delta;

      // Get the camera's forward direction projected onto the XZ plane (the floor)
      camera.getWorldDirection(direction);
      direction.y = 0; // Lock movement to the floor
      direction.normalize();

      // Get the camera's rightward direction
      sideVector.set(0, 1, 0).cross(direction).normalize();

      // Combine inputs
      moveVector.set(0, 0, 0);
      if (forward) moveVector.add(direction);
      if (backward) moveVector.sub(direction);
      if (left) moveVector.add(sideVector);
      if (right) moveVector.sub(sideVector);

      moveVector.normalize().multiplyScalar(moveDistance);

      // Apply to camera position
      camera.position.add(moveVector);
    }

    // 2. CALCULATE VERTICAL MOVEMENT (Arrows)
    if (up || down) {
      const vertSpeed = 30;
      const vertDistance = vertSpeed * delta;
      
      // Pure vertical lift/drop
      camera.position.y += (Number(up) - Number(down)) * vertDistance;
    }

    // 3. EYE-LEVEL ENFORCEMENT
    // In walk mode, if not flying, stay at 1.5m. In top mode, stay above the floor.
    if (mode === 'walk' && !up && !down) {
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 1.5, 0.1);
    } else if (camera.position.y < 0.5) {
      camera.position.y = 0.5; // Floor collision safety
    }
  });

  return null;
};

export default Movement;