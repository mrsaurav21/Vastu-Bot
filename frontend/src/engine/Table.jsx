import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useConfigurator } from "../pages/store/ConfiguratorContext"; // Path updated
import * as THREE from "three";

export function Table(props) {
  // Path updated to look in the Vastu-Bot public folder
  const { nodes, materials } = useGLTF('/models/Table.gltf') 
  const { legs, legsColor, tableWidth } = useConfigurator();

  // useMemo prevents creating a new material instance on every render
  const metalMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: legsColor,
      metalness: 1,
      roughness: 0.3,
    });
  }, [legsColor]);

  const tableWidthScale = tableWidth / 100;

  return (
    <group {...props} dispose={null}>
      {/* Table Top */}
      <mesh
        castShadow
        geometry={nodes.Plate.geometry}
        material={materials.Plate}
        scale={[tableWidthScale, 1, 1]}
      />

      {/* Legs Layout 01: Standard */}
      {legs === 0 && (
        <>
          <mesh
            castShadow
            geometry={nodes.Legs01Left.geometry}
            material={metalMaterial}
            position={[-1.5, 0, 0]}
          />
          <mesh
            castShadow
            geometry={nodes.Legs01Right.geometry}
            material={metalMaterial}
            position={[1.5, 0, 0]}
          />
        </>
      )}

      {/* Legs Layout 02: Solid */}
      {legs === 1 && (
        <>
          <mesh
            castShadow
            geometry={nodes.Legs02Left.geometry}
            material={metalMaterial}
            position={[-1.5, 0, 0]}
          />
          <mesh
            castShadow
            geometry={nodes.Legs02Right.geometry}
            material={metalMaterial}
            position={[1.5, 0, 0]}
          />
        </>
      )}

      {/* Legs Layout 03: Design */}
      {legs === 2 && (
        <>
          <mesh
            castShadow
            geometry={nodes.Legs03Left.geometry}
            material={metalMaterial}
            position={[-1.5, 0, 0]}
          />
          <mesh
            castShadow
            geometry={nodes.Legs03Right.geometry}
            material={metalMaterial}
            position={[1.5, 0, 0]}
          />
        </>
      )}
    </group>
  )
}

// Preload the model from the public folder for better performance
useGLTF.preload('/models/Table.gltf')