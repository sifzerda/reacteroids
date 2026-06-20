// src/renderers/SmokeRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';
import ParticleRenderer from './ParticleRenderer';
import { smokeParticles } from '../ecs/core/queries';

export default function SmokeRenderer() {

    const material = useMemo(() => {

  return new THREE.PointsMaterial({
    color: 'blue',
    size: 0.5,
    sizeAttenuation: true
  });

    }, []);

return (
    <ParticleRenderer
      particles={smokeParticles}
      max={3000}
      material={material}
    />
  );
}