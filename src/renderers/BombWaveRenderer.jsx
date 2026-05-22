// src/ecs/renderers/BombWaveRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { bombWaves } from '../ecs/queries';

const temp = new THREE.Object3D();

export default function BombWaveRenderer() {

  const meshRef = useRef();
  const geometry = useMemo(() => new THREE.RingGeometry(0.65, 1, 128), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#ff2222',
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }), []);

  useFrame(() => {

    let i = 0;
    for (const wave of bombWaves) {
      temp.position.set(wave.x, wave.y, 0);

      // pulse effect

      const pulse = 1 + Math.sin(performance.now() * 0.02) * 0.08;

      temp.scale.setScalar(wave.radius * pulse);
      temp.updateMatrix();
      meshRef.current.setMatrixAt(i++, temp.matrix);
    }

    meshRef.current.count = i;

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

return (
  <instancedMesh
    ref={meshRef}
    args={[geometry, material, 32]}
  />
);
}