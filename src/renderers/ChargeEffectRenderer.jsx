// src/renderers/ChargeEffectRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { chargeEffects } from '../ecs/core/queries';

const COUNT = 128;

export default function ChargeEffectRenderer() {

  const meshRef = useRef();

  const geometry = useMemo(() => {

    const plane = new THREE.PlaneGeometry(1, 1);

    const geo = new THREE.InstancedBufferGeometry();

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    const angles = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const randoms = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {

      angles[i] = Math.random() * Math.PI * 2;

      speeds[i] =
        0.4 +
        Math.random() * 1.8;

      sizes[i] =
        0.04 +
        Math.random() * 0.10;

      randoms[i] =
        Math.random() * 1000;

    }

    geo.setAttribute(
      'angle',
      new THREE.InstancedBufferAttribute(angles, 1)
    );

    geo.setAttribute(
      'speed',
      new THREE.InstancedBufferAttribute(speeds, 1)
    );

    geo.setAttribute(
      'size',
      new THREE.InstancedBufferAttribute(sizes, 1)
    );

    geo.setAttribute(
      'random',
      new THREE.InstancedBufferAttribute(randoms, 1)
    );

    geo.instanceCount = COUNT;

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
        uCharge: { value: 0 },
        uCenter: { value: new THREE.Vector2() },

      },

      vertexShader: `

        attribute float angle;
        attribute float speed;
        attribute float size;
        attribute float random;

        uniform float uTime;
        uniform float uCharge;
        uniform vec2 uCenter;

        varying vec2 vUv;
        varying float vAlpha;
        varying float vCharge;

        void main() {

          vUv = uv;
          vCharge = uCharge;

          float burst =
            1.0 +
            sin(
              uTime * 10.0 +
              random
            ) * 0.15 * uCharge;

          float radius =
            speed *
            pow(uCharge, 2.5) *
            7.0 *
            burst;

          vec2 dir = vec2(
            cos(angle),
            sin(angle)
          );

          vec2 pos =
            uCenter +
            dir * radius;

          pos += vec2(
            sin(uTime * 11.0 + random),
            cos(uTime * 13.0 + random)
          ) * 0.12 * uCharge;

          vec3 transformed = position;

          transformed.xy *=
            size *
            (0.6 + uCharge * 2.0);

          transformed.xy += pos;

          vAlpha =
            (1.0 - radius / 14.0)
            * (0.3 + uCharge);

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(
              transformed,
              1.0
            );

        }

      `,

      fragmentShader: `

        varying vec2 vUv;
        varying float vAlpha;
        varying float vCharge;

        void main() {

          vec2 p =
            vUv - 0.5;

          float d =
            length(p);

          float particle =
            smoothstep(
              0.5,
              0.0,
              d
            );

          float core =
            smoothstep(
              0.18,
              0.0,
              d
            );

          float glow =
            smoothstep(
              0.65,
              0.0,
              d
            );

          float alpha =
            particle * vAlpha;

          vec3 color = vec3(0.0);

          // particle cloud

          color +=
            vec3(
              0.2,
              0.9,
              1.0
            ) *
            particle *
            2.0;

          // cyan energy glow

          color +=
            vec3(
              0.2,
              0.9,
              1.0
            ) *
            glow *
            vCharge *
            3.0;

          // white-hot center

          color +=
            vec3(1.0) *
            core *
            (
              2.0 +
              vCharge * 6.0
            );

          alpha +=
            glow *
            0.25 *
            vCharge;

          alpha +=
            core *
            0.5 *
            vCharge;

          if (alpha < 0.01)
            discard;

          gl_FragColor =
            vec4(
              color,
              alpha
            );

        }

      `,

    });

  }, []);

  useFrame((state) => {

    const effect = chargeEffects.first;
    const mesh = meshRef.current;

    if (!effect) {

      mesh.visible = false;
      return;

    }

    mesh.visible = true;

    material.uniforms.uTime.value =
      state.clock.elapsedTime;

    material.uniforms.uCharge.value =
      effect.charge;

    material.uniforms.uCenter.value.set(
      effect.x,
      effect.y
    );

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