// src/renderers/ChargeEffectRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { chargeEffects } from '../ecs/core/queries';
import * as THREE from 'three';

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
        uCharge: { value: 0 }
      },

      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }

      `,

      fragmentShader: `

varying vec2 vUv;

uniform float uTime;
uniform float uCharge;

void main() {

  vec2 p = (vUv - 0.5) * 2.0;

  float charge = clamp(uCharge, 0.0, 1.0);
  float arcs = 0.0;

  const int MAX_ARCS = 16;
  int arcCount = int(mix(2.0, float(MAX_ARCS), charge));

  for(int i = 0; i < MAX_ARCS; i++) {

    if(i >= arcCount) break;
    float fi = float(i);
    float angle = fi * 2.39996 + uTime * 0.5;

    float c = cos(angle);
    float s = sin(angle);

    vec2 q = mat2(c,-s, s, c) * p;

    float wave = sin(q.y * 18.0 + uTime * 12.0 + fi * 7.0) * 0.06;
    float line = smoothstep(0.03, 0.0, abs(q.x - wave));
    float lengthMask = smoothstep(1.0, 0.15, length(q));

    arcs += line * lengthMask;

  }

  float flicker = 0.8 + 0.2 * sin(uTime * 60.0);
  arcs *= flicker;
  vec3 color = vec3(0.75, 0.9, 1.0) * arcs;
  float alpha = arcs * (0.2 +charge * 0.8);
  if(alpha < 0.01) discard;
  gl_FragColor = vec4(color, alpha);

}

`
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
    mesh.position.set(effect.x, effect.y, 0);
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uCharge.value = effect.charge;
    mesh.scale.setScalar(0.5 + effect.charge);

  });

  return (

    <mesh ref={meshRef} frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>

  );

}