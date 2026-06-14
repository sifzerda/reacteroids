// src/renderers/EnemyRenderer.jsx

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { enemies } from '../ecs/core/queries';

const MAX = 1000;

const temp = new THREE.Object3D();

const geometry =
  new THREE.SphereGeometry(1, 6, 6);

const material =
  new THREE.MeshBasicMaterial({
    color: 'red'
  });

export default function EnemyRenderer() {

  const ref = useRef();

  useFrame(() => {

    if (!ref.current) return;

    let count = 0;

    for (const enemy of enemies) {

      if (count >= MAX)
        break;

      temp.position.set(
        enemy.x,
        enemy.y,
        0
      );

      temp.rotation.z =
        enemy.rotation || 0;

      temp.scale.setScalar(
        enemy.radius * 2
      );

      temp.updateMatrix();

      ref.current.setMatrixAt(
        count,
        temp.matrix
      );

      count++;
    }

    if (ref.current.count !== count) {

      ref.current.count = count;
    }

    ref.current.instanceMatrix.needsUpdate =
      true;
  });

  return (

    <instancedMesh

      ref={ref}

      args={[
        geometry,
        material,
        MAX
      ]}
    />
  );
}