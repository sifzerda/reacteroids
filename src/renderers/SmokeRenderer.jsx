// src/renderers/SmokeRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';
import ParticleRenderer from './ParticleRenderer';
import { smokeParticles } from '../ecs/core/queries';

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

    gl_PointSize = size * (1.0 + (1.0 - life) * 0.6) * (75.0 / -mvPosition.z);
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

float core = 1.0 - smoothstep(0.0, 0.15, dist);
float edge = 1.0 - smoothstep(0.15, 0.4, dist);
float shape = pow(core * 0.8 + edge * 0.3, 1.0);

float alpha = shape * vLife * vLife * 1.8;

vec3 baseColor = vec3(0.45, 0.35, 0.6);
vec3 coreColor = vec3(0.65, 0.52, 0.8);
vec3 color = mix(baseColor, coreColor, core * vLife * 0.5);

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function SmokeRenderer() {

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
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