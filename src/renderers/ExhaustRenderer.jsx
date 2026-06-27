// src/renderers/ExhaustRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { exhaustParticles } from '../ecs/core/queries';

const MAX = 200;

export default function ExhaustRenderer() {

  const lastCount = useRef(0);

  const { geometry, positionAttr, particleDataAttr } = useMemo(() => {

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX * 3);
    const particleData = new Float32Array(MAX * 2);
    const positionAttr = new THREE.BufferAttribute(positions, 3);

    geometry.setAttribute("position", positionAttr);
    const particleDataAttr = new THREE.BufferAttribute(particleData, 2);
    geometry.setAttribute("particleData", particleDataAttr);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    particleDataAttr.setUsage(THREE.DynamicDrawUsage);

    return { geometry, positionAttr, particleDataAttr }
  }, []);

  const posArr = positionAttr.array;
  const pdArr = particleDataAttr.array;

  const material = useMemo(() => new THREE.ShaderMaterial({

    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: false,
    toneMapped: false,

    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } },

    vertexShader: `

        uniform float uTime;
        uniform float uPixelRatio;

      attribute vec2 particleData;

      varying float vLife;

      void main() {

        float particleSize = particleData.x;
        float life = particleData.y;

        vLife  = life;
        vec3 pos = position;

        float n = sin(pos.x * 8.0 + uTime * 3.0) * cos(pos.y * 8.0 + uTime * 3.0);
        pos.x += (n - 0.5) * 0.08;
        pos.y += (n - 0.5) * 0.08;

        vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);

          float sizeBase = mix(2.0, 4.0, life);

        gl_PointSize = sizeBase * particleSize * uPixelRatio;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,

    fragmentShader: `
      varying float vLife;

      const vec3 hot = vec3(0.3, 0.9, 4.0);
      const vec3 blue = vec3(0.1, 0.4, 1.6);
      const vec3 orange = vec3(1.2, 0.4, 0.1);
      const vec3 smoke  = vec3(0.2, 0.2, 0.2);

void main() {

  vec2 uv = gl_PointCoord - 0.5;

  float wave = sin(uv.y * 20.0 + vLife * 15.0) * 0.03;
  uv.x += wave;

  float dist = length(uv);
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, dist);
  alpha *= 1.2 + uv.y * 1.1;

  float t = 1.0 - vLife;
  vec3 color = hot;
  color = mix(color, blue,   smoothstep(0.0,  0.15, t));
  color = mix(color, orange, smoothstep(0.25, 0.6,  t));
  color = mix(color, smoke,  smoothstep(0.7,  1.0,  t));
  color += wave;

  alpha *= vLife;

  float puff = 1.0 - clamp(dist * dist * 4.0, 0.0, 1.0);
  float fadeIn  = smoothstep(0.0, 0.3, 1.0 - vLife);
  float fadeOut = vLife * vLife;

  alpha *= puff * fadeIn * fadeOut;
  color *= 2.2;

  gl_FragColor = vec4(color, clamp(alpha * 1.8, 0.0, 1.0));
}
`,

  }), []);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;

    let i = 0;

    for (const p of exhaustParticles) {

      if (i >= MAX) break;

      const i3 = i * 3;

      posArr[i3 + 0] = p.x;
      posArr[i3 + 1] = p.y;
      posArr[i3 + 2] = 0;

      const i2 = i * 2;
      pdArr[i2] = p.size;
      pdArr[i2 + 1] = p.life;

      i++;
    }

    if (lastCount.current !== i) {
      geometry.setDrawRange(0, i);
      lastCount.current = i;
    }

    if (i > 0) {
      positionAttr.needsUpdate = true;
      particleDataAttr.needsUpdate = true;
    }
  });

  return (
    <points geometry={geometry} material={material} frustumCulled={false} />
  );
}