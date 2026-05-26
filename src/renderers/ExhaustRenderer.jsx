// src/renderers/ExhaustRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { exhaustParticles } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 4000;

const temp = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function ExhaustRenderer() {
  const meshRef = useRef();

  // Elongated geometry for velocity streaks
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.06, 8, 8);

    // stretch into a trail shape
    geo.scale(0.7, 2.8, 0.7);

    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      toneMapped: false,

      uniforms: {
        uTime: { value: 0 },
      },

      vertexShader: `
        attribute vec3 instanceColor;

        varying vec3 vColor;
        varying float vLife;
        varying vec2 vUv;

        uniform float uTime;

        void main() {
          vUv = uv;
          vColor = instanceColor;

          // pulse animation
          vLife = sin(uTime * 8.0 + position.y * 14.0) * 0.5 + 0.5;

          vec3 transformed = position;

          // synthwave wobble distortion
          transformed.x += sin(
            uTime * 12.0 +
            position.y * 20.0
          ) * 0.015;

          transformed.z += cos(
            uTime * 9.0 +
            position.x * 18.0
          ) * 0.015;

          vec4 mvPosition =
            modelViewMatrix *
            instanceMatrix *
            vec4(transformed, 1.0);

          gl_Position =
            projectionMatrix *
            mvPosition;
        }
      `,

      fragmentShader: `
        varying vec3 vColor;
        varying float vLife;
        varying vec2 vUv;

        void main() {

          vec2 uv = vUv - 0.5;

          float dist = length(uv);

          // soft radial glow
          float glow = smoothstep(
            0.65,
            0.0,
            dist
          );

          // hot center
          float core = pow(glow, 6.0);

          // outer haze
          float haze = pow(glow, 1.5);

          // synthwave gradient
          vec3 cyan = vec3(0.0, 1.0, 1.0);
          vec3 pink = vec3(1.0, 0.0, 0.8);
          vec3 purple = vec3(0.5, 0.0, 1.0);

          vec3 synth = mix(
            cyan,
            pink,
            vUv.y
          );

          synth = mix(
            synth,
            purple,
            vLife * 0.5
          );

          // neon intensity
          vec3 finalColor =
            (vColor + synth * 1.5) *
            (haze * 1.2 + core * 4.0);

          // scanline shimmer
          float scan =
            sin(vUv.y * 80.0 + vLife * 8.0) * 0.04;

          finalColor += scan;

          float alpha =
            glow *
            (0.65 + core);

          gl_FragColor =
            vec4(finalColor, alpha);
        }
      `,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.uTime.value =
      state.clock.elapsedTime;

    let i = 0;

    for (const exhaust of exhaustParticles) {

      // POSITION
      temp.position.set(
        exhaust.x,
        exhaust.y,
        0
      );

      // stretch by lifetime
      const s = exhaust.life * 3.2;

      temp.scale.set(
        s * 0.55,
        s * 1.8,
        s * 0.55
      );

      // fake velocity orientation
      if (
        exhaust.vx !== undefined &&
        exhaust.vy !== undefined
      ) {
        temp.rotation.z =
          Math.atan2(
            exhaust.vy,
            exhaust.vx
          ) - Math.PI * 0.5;
      }

      temp.updateMatrix();

      meshRef.current.setMatrixAt(
        i,
        temp.matrix
      );

      // stronger synthwave colors
      tempColor.setRGB(
        exhaust.colorR * 1.8,
        exhaust.colorG * 0.5,
        exhaust.colorB * 2.2
      );

      meshRef.current.setColorAt(
        i,
        tempColor
      );

      i++;
    }

    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX]}
      frustumCulled={false}
      renderOrder={10}
    />
  );
}