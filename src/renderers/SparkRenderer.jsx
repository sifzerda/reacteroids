// src/renderers/SparkRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';
import ParticleRenderer from './ParticleRenderer';
import { sparkParticles } from '../ecs/core/queries';

export default function SparkRenderer() {

    const material = useMemo(() => {

  return new THREE.PointsMaterial({
    color: 'yellow',
    size: 0.25,
    sizeAttenuation: true
  });

    }, []);

    return (
        <ParticleRenderer
            particles={sparkParticles}
            max={4000}
            material={material}
        />
    );
}