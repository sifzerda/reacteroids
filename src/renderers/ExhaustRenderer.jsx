// src/renderers/ExhaustRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';

import ParticleRenderer from './ParticleRenderer';
import { exhaustParticles } from '../ecs/core/queries';

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

    // Particles grow slightly as they age
    gl_PointSize = size * (1.0 + (1.0 - life) * 0.6) * (75.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vLife;
  varying vec3 vColor;

  void main() {
    // Soft circular falloff — kills the hard square sprite
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    // Bright core, soft edge
    float core = 1.0 - smoothstep(0.0, 0.25, dist);
    float edge = 1.0 - smoothstep(0.25, 0.5, dist);
    float shape = core * 0.4 + edge * 0.1;

    // Fade out as life depletes
    float alpha = shape * vLife * vLife * 0.7;

    // Hot core: push toward white/yellow at high life
    vec3 hotColor = mix(vColor, vec3(1.0, 0.95, 0.6), core * vLife * 0.25);

    gl_FragColor = vec4(hotColor, alpha);
  }
`;

export default function ExhaustRenderer() {

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
      particles={exhaustParticles}
      max={10000}
      material={material}
    />
  );
}