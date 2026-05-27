// src/renderers/ShipRenderer.jsx

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { ships } from '../ecs/queries';

export default function ShipRenderer() {

  const shipRef = useRef();
  const glowRef = useRef();

  useFrame(() => {

    for (const ship of ships) {

      shipRef.current.position.set(
        ship.x,
        ship.y,
        0
      );

      glowRef.current.position.set(
        ship.x,
        ship.y,
        -0.01
      );

      shipRef.current.rotation.z =
        ship.rotation - Math.PI / 2;

      glowRef.current.rotation.z =
        ship.rotation - Math.PI / 2;
    }
  });

  // Main ship geometry
  const shipGeometry = useMemo(() => {

    const vertices = new Float32Array([

      // Nose
      0.0, 0.7, 0,

      // Left wing
      -0.55, -0.15, 0,

      // Left rear
      -0.2, -0.05, 0,


      0.0, 0.7, 0,

      0.2, -0.05, 0,

      0.55, -0.15, 0,

      // rear fin
      -0.2, -0.05, 0,
      0.0, -0.30, 0,
      0.2, -0.05, 0

    ]);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );

    geometry.computeVertexNormals();

    return geometry;

  }, []);

  // Neon green highlight geometry
  const glowGeometry = useMemo(() => {

    const vertices = new Float32Array([

      // Cockpit stripe
      0.0, 0.45, 0,
      -0.08, 0.1, 0,
      0.08, 0.1, 0,

      // Left wing highlight
      -0.42, -0.12, 0,
      -0.18, -0.08, 0,
      -0.30, -0.22, 0,

      // Right wing highlight
      0.42, -0.12, 0,
      0.18, -0.08, 0,
      0.30, -0.22, 0

    ]);

    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );

    geometry.computeVertexNormals();

    return geometry;

  }, []);

  return (
    <group>

      {/* Main ship */}
      <mesh
        ref={shipRef}
        geometry={shipGeometry}
      >
        <meshBasicMaterial
          color="cyan"
          wireframe
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Fluro green highlights */}
      <mesh
        ref={glowRef}
        geometry={glowGeometry}
      >
        <meshBasicMaterial
          color="#39ff14"
          side={THREE.DoubleSide}
        />
      </mesh>

    </group>
  );
}