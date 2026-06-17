// src/renderers/ChargeEffectRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { chargeEffects } from '../ecs/core/queries';

export default function ChargeEffectRenderer() {

  const meshRef = useRef();

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,

      uniforms: {

        uTime: { value: 0 },
        uCharge: { value: 0 },

      },

      vertexShader: `

        varying vec2 vUv;

        void main() {

          vUv = uv;

          gl_Position =
            projectionMatrix *
            modelViewMatrix *
            vec4(position, 1.0);
        }

      `,

      fragmentShader: `

        uniform float uTime;
        uniform float uCharge;

        varying vec2 vUv;

        void main() {

          vec2 p = vUv - 0.5;

          float d = length(p);

          float core =
            smoothstep(0.18, 0.0, d);

          float ring =
            smoothstep(0.32, 0.28, d) -
            smoothstep(0.42, 0.38, d);

          float angle =
            atan(p.y, p.x);

          float spokes =
            abs(
              sin(
                angle * 8.0 +
                uTime * (5.0 + uCharge * 25.0)
              )
            );

          ring += spokes * 0.12 * uCharge;

          float pulse =
            0.75 +
            0.25 *
            sin(
              uTime *
              (6.0 + uCharge * 30.0)
            );

          vec3 color =
            vec3(0.0, 1.0, 1.0) *
            (ring * 5.0 + core * 2.0) *
            pulse;

          float alpha =
            ring +
            core * 0.35;

          alpha *= 0.6 + uCharge * 0.8;

          if (alpha < 0.01) discard;

          gl_FragColor =
            vec4(color, alpha);
        }

      `,

    });

  }, []);

  useFrame((state) => {

    material.uniforms.uTime.value =
      state.clock.elapsedTime;

    const effect =
      chargeEffects.first;

    if (!effect) {

      if (meshRef.current) {
        meshRef.current.visible = false;
      }

      return;
    }

    material.uniforms.uCharge.value =
      effect.charge ?? 0;

    meshRef.current.visible = true;

    meshRef.current.position.set(
      effect.x,
      effect.y,
      2
    );

    const scale =
      0.6 +
      (effect.charge ?? 0) * 3.0;

    meshRef.current.scale.set(
      scale,
      scale,
      1
    );
  });

  return (

    <mesh
      ref={meshRef}
      frustumCulled={false}
    >

      <planeGeometry args={[1, 1]} />

      <primitive
        object={material}
        attach="material"
      />

    </mesh>

  );
}