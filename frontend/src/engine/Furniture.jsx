import React, { useMemo, useRef, useEffect } from 'react';
import { useGLTF, PivotControls } from '@react-three/drei';
import * as THREE from 'three';
import useDesignStore from '../pages/store/useDesignStore';

const Furniture = ({ data }) => {
  const { url, id, position, rotation } = data;
  const { scene } = useGLTF(url);
  const meshRef = useRef();
  
  const { 
    activeItem, 
    setActiveItem, 
    editMode, // 'move' or 'rotate'
    removeFurniture,
    updateFurniturePosition,
    updateFurnitureRotation
  } = useDesignStore();
  
  const isSelected = activeItem === id;

  // 1. AUTO-SCALE & NORMALIZATION
  const scaledScene = useMemo(() => {
    const clone = scene.clone();
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const targetHeight = 2.5; 
    const scaleFactor = targetHeight / (size.y || 1);
    clone.scale.setScalar(scaleFactor);
    return clone;
  }, [scene]);

  // 2. KEYBOARD DELETE
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && (e.key === 'Delete' || e.key === 'Backspace')) {
        removeFurniture(id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, id, removeFurniture]);

  return (
    <group>
      {/* CRITICAL FIX: 
        We use a unique 'key' that changes when mode changes. 
        This kills the old gizmo and spawns a fresh one.
      */}
      <PivotControls
        key={`${id}-${editMode}-${isSelected}`}
        visible={isSelected}
        
        // --- THE MODE FIX ---
        // Instead of true/false arrays, we explicitly disable what we don't need
        disableAxes={editMode === 'rotate'}
        disableRotations={editMode === 'move'}
        
        // If rotate mode, we show all 3 rings. If move, we show all 3 arrows.
        activeAxes={[true, true, true]} 
        
        autoTransform={true}
        depthTest={false}
        scale={isSelected ? 0.75 : 0}
        anchor={[0, -1, 0]} 
        
        // Color feedback
        color={editMode === 'move' ? "#3b82f6" : "#f97316"}

        onDragEnd={() => {
          if (meshRef.current) {
            const worldPos = new THREE.Vector3();
            meshRef.current.getWorldPosition(worldPos);
            updateFurniturePosition(id, [worldPos.x, worldPos.y, worldPos.z]);

            const worldQuat = new THREE.Quaternion();
            meshRef.current.getWorldQuaternion(worldQuat);
            const euler = new THREE.Euler().setFromQuaternion(worldQuat);
            updateFurnitureRotation(id, [euler.x, euler.y, euler.z]);
          }
        }}
      >
        <primitive 
          ref={meshRef}
          object={scaledScene} 
          position={position} 
          rotation={rotation}
          castShadow 
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            setActiveItem(id);
          }}
        />
      </PivotControls>
    </group>
  );
};

export default Furniture;