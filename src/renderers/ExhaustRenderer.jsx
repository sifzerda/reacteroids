// src/renderers/ExhaustRenderer.jsx

// src/renderers/ExhaustRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { exhaustParticles } from '../ecs/core/queries';

const MAX = 12000;

export default function ExhaustRenderer() {

  const pointsRef = useRef();

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(MAX * 3);
    const sizes     = new Float32Array(MAX);
    const lifes     = new Float32Array(MAX);
    const colors    = new Float32Array(MAX * 3);

    geo.setAttribute('position',      new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('particleSize',  new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('life',          new THREE.BufferAttribute(lifes, 1));
    geo.setAttribute('particleColor', new THREE.BufferAttribute(colors, 3));

    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.particleSize.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.life.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.particleColor.setUsage(THREE.DynamicDrawUsage);

    return geo;

  }, []);

  const material = useMemo(() => new THREE.ShaderMaterial({

    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    toneMapped:  false,

    vertexShader: `
      attribute float particleSize;
      attribute float life;
      attribute vec3  particleColor;

      varying float vLife;
      varying vec3  vColor;

      void main() {
        vLife  = life;
        vColor = particleColor;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

        // expand as life depletes — puff grows over time
float expand = 1.0 + (1.0 - life) * 12.0;
gl_PointSize = particleSize * expand * (10.0 / -mvPosition.z);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,

    fragmentShader: `
      varying float vLife;
      varying vec3  vColor;

      void main() {
        vec2  uv   = gl_PointCoord - 0.5;
        float dist = length(uv);

        // gaussian puff — no hard edge, just soft falloff
        float puff = exp(-dist * dist * 10.0);

        // fade in briefly then fade out over life
        float fadeIn  = smoothstep(0.0, 0.3, 1.0 - vLife);
        float fadeOut = vLife * vLife;
        float alpha   = puff * fadeIn * fadeOut * 0.35;

        // cool from blue-white toward dark grey as life fades
        vec3 hot  = vColor;
        vec3 cool = vec3(0.08, 0.08, 0.12);
        vec3 color = mix(cool, hot, vLife * 0.6);

        gl_FragColor = vec4(color, alpha);
      }
    `,

  }), []);

  useFrame(() => {

    const positions = geometry.attributes.position.array;
    const sizes     = geometry.attributes.particleSize.array;
    const lifes     = geometry.attributes.life.array;
    const colors    = geometry.attributes.particleColor.array;

    let i = 0;

    for (const p of exhaustParticles) {

      if (i >= MAX) break;

      const i3 = i * 3;

      positions[i3]     = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = 0;

      sizes[i] = p.size ?? 10;
      lifes[i] = p.life ?? 1;

      colors[i3]     = p.colorR ?? 0.2;
      colors[i3 + 1] = p.colorG ?? 0.7;
      colors[i3 + 2] = p.colorB ?? 2.0;

      i++;
    }

    geometry.setDrawRange(0, i);

    geometry.attributes.position.needsUpdate      = true;
    geometry.attributes.particleSize.needsUpdate  = true;
    geometry.attributes.life.needsUpdate          = true;
    geometry.attributes.particleColor.needsUpdate = true;
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}