// src/ecs/weapons/FlamethrowerRenderer.js

import { flamethrowers } from '../ecs/queries';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FlamethrowerRenderer() {

     const material = useMemo(() => {

    return new THREE.MeshBasicMaterial({

      transparent: true,

      opacity: 0.7,

      blending: THREE.AdditiveBlending,

      depthWrite: false,

      color: '#ff6600',
    });

  }, []);

  const meshes = [];

  let i = 0;

  for (const flame of flamethrowers) {

    const ship = flame.ship;

    const length = flame.length;

    meshes.push(

      <mesh
        key={i++}
        position={[
          ship.x + Math.cos(ship.rotation) * length * 0.5,
          ship.y + Math.sin(ship.rotation) * length * 0.5,
          0
        ]}
        rotation={[0, 0, ship.rotation]}
        material={material}
      >

        {/* cone-shaped flame */}

        <coneGeometry
          args={[
            length * 0.25,
            length,
            16,
            1,
            true
          ]}
        />

      </mesh>
    );
  }

  return <>{meshes}</>;
}

