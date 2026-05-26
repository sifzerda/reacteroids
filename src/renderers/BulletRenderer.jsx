// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { bullets } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 2000;
const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function BulletRenderer() {

  const meshRef = useRef();
    // Long laser streak
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(0.18, 1.0);
  }, []);
  const material = useMemo(() => {

    return new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    });

  }, []);


  useFrame(() => {
    const mesh = meshRef.current;
     if (!mesh) return;
    let i = 0;

    for (const bullet of bullets) {
      // POSITION
      tempObj.position.set(
        bullet.x,
        bullet.y,
        0
      );

      tempObj.rotation.z = bullet.rotation - Math.PI / 2

      tempObj.updateMatrix();

      meshRef.current.setMatrixAt(
        i,
        tempObj.matrix
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