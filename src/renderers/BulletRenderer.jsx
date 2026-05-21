// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { bullets } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 2000;
const temp = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function BulletRenderer() {

  const meshRef = useRef();
  const geometry = useMemo(() => new THREE.BoxGeometry(0.4, 0.08, 0.08), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, }), []);

  useFrame(() => {
    let i = 0;

    for (const bullet of bullets) {
      // POSITION
      temp.position.set(
        bullet.x,
        bullet.y,
        0
      );

      temp.rotation.z = bullet.rotation;

      temp.updateMatrix();

      meshRef.current.setMatrixAt(
        i,
        temp.matrix
      );
      // COLOR

      tempColor.setRGB(
        bullet.colorR,
        bullet.colorG,
        bullet.colorB
      );

            meshRef.current.setColorAt(
        i,
        tempColor
      );

      i++;
    }
    
      meshRef.current.count = i;
      meshRef.current.instanceMatrix.needsUpdate = true;

      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
      }
    });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX]}
    />
  );
}