// src/renderers/ShipRenderer.jsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ships } from '../ecs/queries';

export default function ShipRenderer() {
  const meshRef = useRef();

  useFrame(() => {
    for (const ship of ships) {

      meshRef.current.position.set(
        ship.x,
        ship.y,
        0
      );

      meshRef.current.rotation.z =
        ship.rotation - Math.PI / 2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <coneGeometry args={[0.3, 0.7, 3]} />

      <meshBasicMaterial
        color="cyan"
        wireframe
      />
    </mesh>
  );
}