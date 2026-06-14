// src/renderers/AsteroidRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { asteroids } from '../ecs/core/queries';

const MAX = 1000;

const temp = new THREE.Object3D();

export default function AsteroidRenderer() {

  const meshRef = useRef();

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
      color: '#6b6258',      // rocky asteroid brown/gray
      roughness: 1,
      metalness: 0,
      flatShading: true,
    }),
  []
);

  useFrame(() => {

    let i = 0;

    for (const asteroid of asteroids) {

      temp.position.set(asteroid.x, asteroid.y, 0);
      temp.rotation.z = asteroid.rotation;
      temp.scale.setScalar(asteroid.radius);
      temp.updateMatrix();

      meshRef.current.setMatrixAt(i++, temp.matrix);
    }

    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, MAX]} />
  );
}