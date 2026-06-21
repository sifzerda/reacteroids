// src/ecs/renderers/ParticleRenderer.jsx

import { useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STRIDE = 9;

export default function ParticleRenderer({ particles, max, material }) {

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

    const data = new Float32Array(max * STRIDE);
    const interleaved = new THREE.InterleavedBuffer(data, STRIDE);

    interleaved.setUsage(THREE.DynamicDrawUsage);

    geo.setAttribute('position', new THREE.InterleavedBufferAttribute(interleaved, 3, 0));
    geo.setAttribute('life', new THREE.InterleavedBufferAttribute(interleaved, 1, 3));
    geo.setAttribute('size', new THREE.InterleavedBufferAttribute(interleaved, 1, 4));
    geo.setAttribute('particleColor', new THREE.InterleavedBufferAttribute(interleaved, 3, 5));
    geo.setAttribute('rotation', new THREE.InterleavedBufferAttribute(interleaved, 1, 8));

    geo.userData.interleaved = interleaved;

    return geo;

  }, [max]);

  useEffect(() => {

    return () => {

      geometry.dispose();

      if (material.dispose) {
        material.dispose();
      }
    };

  }, [geometry, material]);

  const interleaved = geometry.userData.interleaved;

  useFrame(() => {
    const data = interleaved.array;

    let count = 0;

    for (const p of particles) {

      if (count >= max) break;

      const base = count * STRIDE;

      data[base + 0] = p.x;
      data[base + 1] = p.y;
      data[base + 2] = 0;

      data[base + 3] = p.life ?? 1;
      data[base + 4] = p.size ?? 1;

      data[base + 5] = p.colorR ?? 1;
      data[base + 6] = p.colorG ?? 1;
      data[base + 7] = p.colorB ?? 1;

      data[base + 8] = p.rotation ?? 0;

      count++;
    }

    geometry.setDrawRange(0, count);
    interleaved.needsUpdate = true;

  });

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}