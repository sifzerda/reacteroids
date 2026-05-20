// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { bullets } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 2000;
const temp = new THREE.Object3D();

export default function BulletRenderer() {

  const meshRef = useRef();
  const geometry = useMemo(() => new THREE.BoxGeometry(0.08, 0.4, 0.08), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({color: '#ff66ff', }), []);

  useFrame(() => {
    let i = 0;

    for (const bullet of bullets) {

      temp.position.set(
        bullet.x,
        bullet.y,
        0
      );

      temp.rotation.z =
        bullet.rotation;

      temp.updateMatrix();

      meshRef.current.setMatrixAt(
        i++,
        temp.matrix
      );
    }

    meshRef.current.count = i;

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX]}
    />
  );
}