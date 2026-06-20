// src/renderers/ExhaustRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';

import ParticleRenderer from './ParticleRenderer';

import { exhaustParticles } from '../ecs/core/queries';

export default function ExhaustRenderer() {

  const material = useMemo(() => {

  return new THREE.PointsMaterial({
    color: 'red',
    size: 0.4,
    sizeAttenuation: true
  });

  }, []);

  return (
    <ParticleRenderer
      particles={exhaustParticles}
      max={10000}
      material={material}

    />
  );
}