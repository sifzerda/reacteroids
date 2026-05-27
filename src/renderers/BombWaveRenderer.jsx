// src/ecs/renderers/BombWaveRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { bombWaves } from '../ecs/queries';

const MAX = 128;

export default function BombWaveRenderer() {

  const meshRef = useRef();

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

    // fullscreen quad point positions
    const positions = new Float32Array(MAX * 3);
    const radius = new Float32Array(MAX);
    const intensity = new Float32Array(MAX);

    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );

    geo.setAttribute(
      'radius',
      new THREE.BufferAttribute(radius, 1)
    );

    geo.setAttribute(
      'intensity',
      new THREE.BufferAttribute(intensity, 1)
    );

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,

      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: {
          value: Math.min(window.devicePixelRatio, 2)
        }
      },

      vertexShader: `

        uniform float uTime;
        uniform float uPixelRatio;

        attribute float radius;
        attribute float intensity;

        varying float vIntensity;
        varying float vRadius;

        float hash(float n) {
          return fract(sin(n) * 43758.5453123);
        }

        float noise(vec2 p) {

          vec2 i = floor(p);
          vec2 f = fract(p);

          f = f * f * (3.0 - 2.0 * f);

          float a = hash(i.x + i.y * 57.0);
          float b = hash(i.x + 1.0 + i.y * 57.0);
          float c = hash(i.x + (i.y + 1.0) * 57.0);
          float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0);

          return mix(
            mix(a, b, f.x),
            mix(c, d, f.x),
            f.y
          );
        }

        void main() {

          vIntensity = intensity;
          vRadius = radius;

          vec3 pos = position;

          // heat shimmer distortion
          float n =
            noise(pos.xy * 3.0 + uTime * 2.0);

          pos.x += (n - 0.5) * 0.05;
          pos.y += (n - 0.5) * 0.05;

          vec4 mvPosition =
            modelViewMatrix * vec4(pos, 1.0);

          gl_PointSize =
            radius *
            120.0 *
            uPixelRatio;

          gl_Position =
            projectionMatrix * mvPosition;
        }
      `,

      fragmentShader: `

        varying float vIntensity;
        varying float vRadius;

        void main() {

          vec2 uv =
            gl_PointCoord - 0.5;

          float dist = length(uv);

          // expanding shock ring
          float ring =
            smoothstep(0.36, 0.32, dist) -
            smoothstep(0.32, 0.24, dist);

          // plasma outer glow
          float glow =
            smoothstep(0.5, 0.0, dist) * 0.18;

          // hot center flash
          float core =
            smoothstep(0.12, 0.0, dist);

          // orange/red shockwave
          vec3 ringColor =
            vec3(2.0, 0.4, 0.05);

          // blue plasma core
          vec3 coreColor =
            vec3(0.3, 0.8, 2.5);

          vec3 color =
            ringColor * ring +
            ringColor * glow +
            coreColor * core;

          // animated shimmer
          float flicker =
            sin(
              gl_PointCoord.y * 40.0 +
              vRadius * 8.0
            ) * 0.05;

          color += flicker;

          float alpha =
            (ring + glow + core * 0.4)
            * vIntensity;

          gl_FragColor =
            vec4(color, alpha);
        }
      `
    });

  }, []);

  useFrame((state) => {

    material.uniforms.uTime.value =
      state.clock.elapsedTime;

    const positions =
      geometry.attributes.position.array;

    const radii =
      geometry.attributes.radius.array;

    const intensities =
      geometry.attributes.intensity.array;

    let i = 0;

    for (const wave of bombWaves) {

      if (i >= MAX) break;

      const i3 = i * 3;

      positions[i3 + 0] = wave.x;
      positions[i3 + 1] = wave.y;
      positions[i3 + 2] = 0;

      radii[i] = wave.radius;

      // fade with expansion
      intensities[i] =
        THREE.MathUtils.clamp(
          1.0 - wave.radius * 0.04,
          0,
          1
        );

      i++;
    }

    geometry.setDrawRange(0, i);

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.radius.needsUpdate = true;
    geometry.attributes.intensity.needsUpdate = true;
  });

  return (
    <points
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}