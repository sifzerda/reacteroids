// src/renderers/ChargeEffectRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { chargeEffects } from '../ecs/core/queries';

export default function ChargeEffectRenderer() {

  const meshRef = useRef();

  const material = useMemo(() => new THREE.ShaderMaterial({

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

        // Completely eliminate quad corners
        if (d > 0.5) discard;

        float core =
          smoothstep(0.16, 0.0, d);

        float ring =
          smoothstep(0.32, 0.28, d) -
          smoothstep(0.42, 0.38, d);

        float angle =
          atan(p.y, p.x);

        float spokes =
          abs(
            sin(
              angle * 8.0 +
              uTime * (5.0 + uCharge * 20.0)
            )
          );

        ring +=
          spokes *
          0.1 *
          uCharge;

        float pulse =
          0.8 +
          0.2 *
          sin(
            uTime *
            (8.0 + uCharge * 25.0)
          );

        float alpha =
          (ring + core * 0.3) *
          (0.5 + uCharge);

        if (alpha < 0.01) discard;

        vec3 color =
          vec3(0.0, 1.0, 1.0) *
          (core * 2.0 + ring * 4.0) *
          pulse;

        gl_FragColor =
          vec4(color, alpha);

      }

    `,

  }), []);

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

    mesh.position.x = effect.x;
    mesh.position.y = effect.y;

    const scale =
      0.6 + effect.charge * 2.8;

    mesh.scale.setScalar(scale);

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