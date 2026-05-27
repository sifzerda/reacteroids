// src/renderers/ExhaustRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { exhaustParticles } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 4000;
const temp = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function ExhaustRenderer() {

  const meshRef = useRef();
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.1, 0.1, 8, 8), []); // base.x, base.y, length, particles
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, }), []);

  useFrame(() => {
    let i = 0;

    for (const exhaust of exhaustParticles) {

      // POSITION
      temp.position.set(exhaust.x, exhaust.y, 0);

      // SCALE
      temp.scale.setScalar(exhaust.life * 2);

      temp.updateMatrix();
      meshRef.current.setMatrixAt(i, temp.matrix);

      // COLOR
      tempColor.setRGB(exhaust.colorR, exhaust.colorG, exhaust.colorB);
      meshRef.current.setColorAt(i, tempColor);
      i++;
    }

    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, MAX]} />
  );
}