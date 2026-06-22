// src/renderers/SparkRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';
import ParticleRenderer from './ParticleRenderer';
import { sparkParticles } from '../ecs/core/queries';

const vertexShader = `
  attribute float life;
  attribute float size;
  attribute vec3 particleColor;

  varying float vLife;
  varying vec3 vColor;

  void main() {
    vLife = life;
    vColor = particleColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (0.3 + life * 0.7) * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vLife;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float core = 1.0 - smoothstep(0.0, 0.05, dist);
    float ember = 1.0 - smoothstep(0.05, 0.18, dist);
    float shape = core + ember * 0.15;
    vec3 color = vColor;
    color = mix(color, vec3(1.0), core * 0.85);
    float alpha = pow(shape, 8.0) * (0.4 + vLife * 1.5);
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function SparkRenderer() {

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
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