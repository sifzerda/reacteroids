// src/renderers/FlashRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';

import ParticleRenderer from './ParticleRenderer';

import { flashParticles } from '../ecs/core/queries';

export default function FlashRenderer() {

  const material = useMemo(() => {

  return new THREE.PointsMaterial({
    color: 'lime',
    size: 0.6,
    sizeAttenuation: true
  });

  }, []);

  return (
    <ParticleRenderer
      particles={flashParticles}
      max={1000}
      material={material}
    />
  );
}