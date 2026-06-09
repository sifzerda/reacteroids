// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { bullets } from '../ecs/core/queries';

const MAX = 12000;

export default function BulletRenderer() {

  const meshRef = useRef();

  const geometry = useMemo(() => {

    const geo = new THREE.InstancedBufferGeometry();

    // base quad
    const plane = new THREE.PlaneGeometry(1, 1);

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    // instance data
    const offsets = new Float32Array(MAX * 3);
    const rotations = new Float32Array(MAX);
    const colors = new Float32Array(MAX * 3);
    const speeds = new Float32Array(MAX);

    geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('rotation', new THREE.InstancedBufferAttribute(rotations, 1));
    geo.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colors, 3));
    geo.setAttribute('speed', new THREE.InstancedBufferAttribute(speeds, 1));

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,

      uniforms: {uTime: {value: 0}},

      vertexShader: `

        uniform float uTime;

        attribute vec3 offset;
        attribute float rotation;
        attribute vec3 instanceColor;
        attribute float speed;

        varying vec2 vUv;
        varying vec3 vColor;
        varying float vSpeed;

        mat2 rotate2D(float a) {

          float s = sin(a);
          float c = cos(a);

          return mat2(
             c, -s,
             s,  c
          );
        }

        // cheap noise
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

          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {

          vUv = uv;
          vColor = instanceColor;
          vSpeed = speed;

          vec3 pos = position;

// rotate FIRST
pos.xy = rotate2D(rotation) * pos.xy;

// proper world forward
vec2 forward = vec2(cos(rotation), sin(rotation));

// perpendicular
vec2 side = vec2(-forward.y, forward.x);

// decompose
float f = dot(pos.xy, forward);
float s = dot(pos.xy, side);

// stretch in LOCAL bullet space
f *= 3.0 + speed * 0.06;
s *= 0.18;

// rebuild
pos.xy = forward * f + side * s;

// plasma distortion
float n = noise(pos.xy * 8.0 + uTime * 8.0);

pos.xy += side * ((n - 0.5) * 0.08);

          // world position
          pos += offset;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `

        varying vec2 vUv;
        varying vec3 vColor;
        varying float vSpeed;

        void main() {

          vec2 uv = vUv - 0.5;

          // elongated bullet
          uv.y *= 0.35;

          float dist = length(uv);

          // hot core
          float core = smoothstep(0.10, 0.0, dist);

          // glow
          float glow = smoothstep(0.55, 0.0, dist);

          // rear taper
          float trail = smoothstep(1.0, 0.1, vUv.y);

          // flare
          float flare = smoothstep(0.25, 0.0, abs(uv.x)) * smoothstep(-0.2, 0.5, uv.y);

          // shimmer
          float shimmer = sin(vUv.y * 80.0 + vSpeed) * 0.05;

          vec3 hot = vec3(2.5);

          vec3 color = vColor * glow * 2.2 + hot * core * 1.8 + vColor * flare;

          color += shimmer;

          float alpha = (glow + core + flare) * trail;

          if(alpha < 0.01) discard;

          gl_FragColor = vec4(color, alpha);
        }
      `
    });

  }, []);

  useFrame((state) => {

    material.uniforms.uTime.value = state.clock.elapsedTime;
    const offsets = geometry.attributes.offset.array;
    const rotations = geometry.attributes.rotation.array;
    const colors = geometry.attributes.instanceColor.array;
    const speeds = geometry.attributes.speed.array;

    let i = 0;

    for (const bullet of bullets) {

      if (i >= MAX) break;

      const i3 = i * 3;

      // position
      offsets[i3 + 0] = bullet.x;
      offsets[i3 + 1] = bullet.y;
      offsets[i3 + 2] = 0;

      // direction
      rotations[i] = bullet.rotation;

      // color
      colors[i3 + 0] = bullet.colorR ?? 1;
      colors[i3 + 1] = bullet.colorG ?? 1;
      colors[i3 + 2] = bullet.colorB ?? 1;

      // speed
      speeds[i] = bullet.speed || 20;

      i++;
    }

    geometry.instanceCount = i;

    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.rotation.needsUpdate = true;
    geometry.attributes.instanceColor.needsUpdate = true;
    geometry.attributes.speed.needsUpdate = true;

  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}
