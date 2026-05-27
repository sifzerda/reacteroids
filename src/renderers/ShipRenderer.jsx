// src/renderers/ShipRenderer.jsx

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { ships } from '../ecs/queries';

export default function ShipRenderer() {

  const groupRef = useRef();

  // Main body
  const bodyGeometry = useMemo(() => {

    const shape = new THREE.Shape();

    // nose
    shape.moveTo(0, 1.2);

    // right side
    shape.lineTo(0.22, 0.5);
    shape.lineTo(0.85, -0.2);
    shape.lineTo(0.45, -0.35);
    shape.lineTo(0.18, -1.0);

    // rear center
    shape.lineTo(0, -0.75);

    // left side
    shape.lineTo(-0.18, -1.0);
    shape.lineTo(-0.45, -0.35);
    shape.lineTo(-0.85, -0.2);
    shape.lineTo(-0.22, 0.5);

    shape.closePath();

    return new THREE.ShapeGeometry(shape);

  }, []);

  // cockpit
  const cockpitGeometry = useMemo(() => {

    const shape = new THREE.Shape();

    shape.moveTo(0, 0.45);
    shape.lineTo(0.12, 0.05);
    shape.lineTo(0, -0.2);
    shape.lineTo(-0.12, 0.05);

    shape.closePath();

    return new THREE.ShapeGeometry(shape);

  }, []);

  useFrame(() => {

    for (const ship of ships) {

      groupRef.current.position.set(
        ship.x,
        ship.y,
        0
      );

      groupRef.current.rotation.z =
        ship.rotation - Math.PI / 2;
    }
  });

  return (

    <group ref={groupRef} scale={0.55}>

      {/* Main ship body */}
      <mesh geometry={bodyGeometry}>
        <meshBasicMaterial
          color="#1e90ff"
        />
      </mesh>

      {/* Green highlight overlay */}
      <mesh geometry={bodyGeometry} position={[0, 0, 0.001]}>
        <meshBasicMaterial
          color="#00ff88"
          wireframe
        />
      </mesh>

      {/* Cockpit */}
      <mesh geometry={cockpitGeometry} position={[0, 0.25, 0.01]}>
        <meshBasicMaterial
          color="#66ffee"
        />
      </mesh>



    </group>
  );
}