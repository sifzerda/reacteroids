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
    const plane = new THREE.PlaneGeometry(1, 1);

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    // instance data
    const offsets = new Float32Array(MAX * 3);
    const rotations = new Float32Array(MAX);
    const colors = new Float32Array(MAX * 3);
    const lengths = new Float32Array(MAX);
    const widths = new Float32Array(MAX);
    const glows = new Float32Array(MAX);
    const distortions = new Float32Array(MAX);

    const offsetAttr = new THREE.InstancedBufferAttribute(offsets, 3);
    offsetAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('offset', offsetAttr);

    const rotationAttr = new THREE.InstancedBufferAttribute(rotations, 1);
    rotationAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('rotation', rotationAttr);

    const instanceColorAttr = new THREE.InstancedBufferAttribute(colors, 3);
    instanceColorAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('instanceColor', instanceColorAttr);

    const bulletLength = new THREE.InstancedBufferAttribute(lengths, 1);
    bulletLength.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletLength', bulletLength);

    const bulletWidth = new THREE.InstancedBufferAttribute(widths, 1);
    bulletWidth.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletWidth', bulletWidth);

    const bulletGlow = new THREE.InstancedBufferAttribute(glows, 1);
    bulletGlow.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletGlow', bulletGlow);

    const bulletDistortion = new THREE.InstancedBufferAttribute(distortions, 1);
    bulletDistortion.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletDistortion', bulletDistortion);

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,

      uniforms: { uTime: { value: 0 } },

      vertexShader: `

        uniform float uTime;

        attribute vec3 offset;
        attribute float rotation;
        attribute vec3 instanceColor;

        varying vec2 vUv;
        varying vec3 vColor;

        attribute float bulletLength;
        attribute float bulletWidth;
        attribute float bulletDistortion;

        varying float vGlow;
        attribute float bulletGlow;
        
        mat2 rotate2D(float a) {

          float s = sin(a);
          float c = cos(a);

          return mat2(
             c, -s,
             s,  c
          );
        }

        void main() {

          vUv = uv;
          vColor = instanceColor;
          vGlow = bulletGlow;
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

f *= bulletLength;
s *= bulletWidth;

// rebuild
pos.xy = forward * f + side * s;

// plasma distortion
float n = sin(pos.x * 15.0 + uTime * 8.0);

pos.xy += side * ((n - 0.5) * 0.08 * bulletDistortion);

          // world position
          pos += offset;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `

      uniform float uTime;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vGlow;

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
 
          float shimmer = sin(vUv.y * 80.0 + uTime * 20.0) * 0.05;

          vec3 hot = vec3(2.5);

          vec3 color = vColor * glow * 2.2 * vGlow + hot * core * 1.8 * vGlow + vColor * flare * vGlow;

          color += shimmer;

          float alpha = (glow + core + flare) * trail * vGlow;

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
    const lengths = geometry.attributes.bulletLength.array;
    const widths = geometry.attributes.bulletWidth.array;
    const glows = geometry.attributes.bulletGlow.array;
    const distortions = geometry.attributes.bulletDistortion.array;

    let count = 0;

    for (const bullet of bullets) {

      if (count >= MAX) break;

      const i3 = count * 3;

      offsets[i3 + 0] = bullet.x;
      offsets[i3 + 1] = bullet.y;
      offsets[i3 + 2] = 0;

      rotations[count] = bullet.rotation;

      colors[i3 + 0] = bullet.colorR ?? 1;
      colors[i3 + 1] = bullet.colorG ?? 1;
      colors[i3 + 2] = bullet.colorB ?? 1;

      lengths[count] = bullet.length ?? 1;
      widths[count] = bullet.width ?? 1;
      glows[count] = bullet.glow ?? 1;
      distortions[count] = bullet.distortion ?? 1;

      count++;
    }

    for (let i = count; i < MAX; i++) {

      const i3 = i * 3;

      offsets[i3 + 0] = 0;
      offsets[i3 + 1] = 0;
      offsets[i3 + 2] = 0;

      lengths[i] = 0;
      widths[i] = 0;
      glows[i] = 0;
    }

    geometry.instanceCount = count;

    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.rotation.needsUpdate = true;
    geometry.attributes.instanceColor.needsUpdate = true;
    geometry.attributes.bulletLength.needsUpdate = true;
    geometry.attributes.bulletWidth.needsUpdate = true;
    geometry.attributes.bulletGlow.needsUpdate = true;
    geometry.attributes.bulletDistortion.needsUpdate = true;

  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
    //  frustumCulled={false}
    />
  );
}
