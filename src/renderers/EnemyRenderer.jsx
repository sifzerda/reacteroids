// src/renderers/EnemyRenderer.jsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import * as THREE from 'three';

import { enemies } from '../ecs/core/queries';

const MAX = 1000;

const temp = new THREE.Object3D();

export default function EnemyRenderer() {

  const ref = useRef();

  useFrame(() => {

    let i = 0;

    for (const enemy of enemies) {

      temp.position.set(
        enemy.x,
        enemy.y,
        0
      );

      temp.scale.setScalar(
        enemy.radius * 2
      );

      temp.updateMatrix();

      ref.current.setMatrixAt(
        i++,
        temp.matrix
      );
    }

    ref.current.count = i;
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (

    <instancedMesh
      ref={ref}
      args={[
        new THREE.SphereGeometry(1,8,8),
        new THREE.MeshBasicMaterial({
          color:'red'
        }),
        MAX
      ]}
    />
  );
}