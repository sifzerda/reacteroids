// src/renderers/ExhaustRenderer.jsx

// src/renderers/ExhaustRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { exhaustParticles } from '../ecs/core/queries';

const MAX = 3000;

export default function ExhaustRenderer() {

  const pointsRef = useRef();

  const { size, viewport } = useThree();

  const { geometry, positionAttr, sizeAttr, lifeAttr, colorAttr, } = useMemo(() => {

    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(MAX * 3);
    const sizes = new Float32Array(MAX);
    const lifes = new Float32Array(MAX);
    const colors = new Float32Array(MAX * 3);
    const positionAttr = new THREE.BufferAttribute(positions, 3);
    const sizeAttr = new THREE.BufferAttribute(sizes, 1);
    const lifeAttr = new THREE.BufferAttribute(lifes, 1);
    const colorAttr = new THREE.BufferAttribute(colors, 3);

    geometry.setAttribute("position", positionAttr);
    geometry.setAttribute("particleSize", sizeAttr);
    geometry.setAttribute("life", lifeAttr);
    geometry.setAttribute("particleColor", colorAttr);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    sizeAttr.setUsage(THREE.DynamicDrawUsage);
    lifeAttr.setUsage(THREE.DynamicDrawUsage);
    colorAttr.setUsage(THREE.DynamicDrawUsage);

    return { geometry, positionAttr, sizeAttr, lifeAttr, colorAttr, };
  }, []);

  const material = useMemo(() => new THREE.ShaderMaterial({

    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    //vertexColors: false,
    toneMapped: false,

    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uViewportHeight: { value: size.height }
    },

    vertexShader: `

        uniform float uTime;
        uniform float uPixelRatio;
        uniform float uViewportHeight;

      attribute float particleSize;
      attribute float life;
      attribute vec3  particleColor;

      varying float vLife;
      varying float vHeat;
      varying vec2 vStretchUv;
      varying vec3  vColor;

      void main() {

        vLife  = life;
        vec3 pos = position;
        vColor = particleColor;

        vec4 mvPosition = modelViewMatrix * vec4(pos,1.0);

                  // animated distortion
        float n = sin(pos.x * 8.0 + uTime * 3.0) * cos(pos.y * 8.0 + uTime * 3.0);

          pos.x += (n - 0.5) * 0.08;
          pos.y += (n - 0.5) * 0.08;

          // heat value
          vHeat = smoothstep(1.0, 0.0, life);

           // velocity stretch amount
          float speed = particleSize;

          // base size
          float sizeBase = mix(2.0, 4.0, life);

          // scale uv by speed and heat
          vStretchUv = vec2(1.0, 1.0) * (speed * 0.5 + 0.5) * (vHeat * 0.6 + 0.4);

        // expand as life depletes — puff grows over time
float expand = 1.0 + (1.0 - life) * 12.0;
 gl_PointSize = sizeBase * particleSize * uPixelRatio;

        gl_Position = projectionMatrix * mvPosition;
      }
    `,

    fragmentShader: `
      varying float vLife;
      varying vec3  vColor;
      varying float vHeat;

      void main() {

        vec2  uv   = gl_PointCoord - 0.5;
        float dist = length(uv);

                  // circular mask
          float alpha = smoothstep(0.35, 0.0, dist);

uv.x += sin(uv.y*20.0+vLife*15.0)*0.03;

          // tapered flame shape
alpha *= 1.2 + uv.y * 1.1;

          // hotter core
          float core = exp(-dist*dist*60.0);

// gas flame colors
vec3 hot = vec3(0.3,0.9,4.0);
vec3 blue = vec3(0.1,0.4,1.6);
vec3 orange = vec3(1.2,0.4,0.1);
vec3 smoke = vec3(0.2);

float t=1.0-vLife;

vec3 color=hot;

color=mix(color,blue,smoothstep(0.0,0.15,t));
color=mix(color,orange,smoothstep(0.25,0.6,t));
color=mix(color,smoke,smoothstep(0.7,1.0,t));

// flicker
float shimmer = sin(gl_PointCoord.y * 20.0 + vLife * 12.0) * 0.03;

    color += shimmer;

              // edge fade
          alpha *= vLife;

        // gaussian puff — no hard edge, just soft falloff
        float puff = exp(-dist * dist * 10.0);

        // fade in briefly then fade out over life
        float fadeIn  = smoothstep(0.0, 0.3, 1.0 - vLife);
        float fadeOut = vLife * vLife;

        alpha *= puff * fadeIn * fadeOut;

        gl_FragColor = vec4(color, alpha);

        color *= 2.2;
      }
    `,

  }), []);

  useFrame((state) => {

    material.uniforms.uTime.value = state.clock.elapsedTime;

    const positions = positionAttr.array;
    const sizes = sizeAttr.array;
    const lifes = lifeAttr.array;
    const colors = colorAttr.array;

    let i = 0;

    for (const p of exhaustParticles) {

      if (i >= MAX) break;

      const i3 = i * 3;

      positions[i3 + 0] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = 0;

      sizes[i] = p.size ?? 10;
      lifes[i] = p.life ?? 1;

      colors[i3] = p.colorR ?? 0.2;
      colors[i3 + 1] = p.colorG ?? 0.7;
      colors[i3 + 2] = p.colorB ?? 2.0;

      i++;
    }

    geometry.setDrawRange(0, i);

    positionAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
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