// src/renderers/FlashRenderer.jsx

// src/renderers/FlashRenderer.jsx

import { useMemo } from 'react';
import * as THREE from 'three';
import ParticleRenderer from './ParticleRenderer';
import { flashParticles } from '../ecs/core/queries';

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

    gl_PointSize = size * (2.5 - life * 1.8) * (900.0 / -mvPosition.z);
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

    float core  = 1.0 - smoothstep(0.0, 0.04, dist);
    float mid   = 1.0 - smoothstep(0.04, 0.15, dist);
    float outer = 1.0 - smoothstep(0.15, 0.35, dist);

    float shape = pow(core + mid * 0.4 + outer * 0.08, 3.5);

    vec3 white     = vec3(0.95, 1.0, 0.9);
    vec3 neon      = vec3(0.0, 1.0, 0.1);
    vec3 deepGreen = vec3(0.0, 0.4, 0.02);

    vec3 color = mix(deepGreen, neon, smoothstep(0.0, 0.2, 1.0 - dist));
    color      = mix(color, white, core);

    float alpha = shape * pow(vLife, 0.3) * 2.5;

    gl_FragColor = vec4(color, alpha);
  }
`;

export default function FlashRenderer() {

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
      particles={flashParticles}
      max={1000}
      material={material}
    />
  );
}