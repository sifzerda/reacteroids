// src/renderers/SparksRenderer.jsx

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { sparkParticles } from '../ecs/core/queries';

const MAX = 12000;

export default function SparksRenderer() {

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(
        new Float32Array(MAX * 3),
        3
      )
    );

    geo.setAttribute(
      'life',
      new THREE.BufferAttribute(
        new Float32Array(MAX),
        1
      )
    );

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
toneMapped: false,

      vertexShader: `

attribute float life;

varying float vLife;

void main() {

  vLife = life;

  vec4 mv =
    modelViewMatrix *
    vec4(position, 1.0);

gl_PointSize = mix(12.0, 4.0, vLife);

  gl_Position =
    projectionMatrix *
    mv;
}
`,

      fragmentShader: `

varying float vLife;

void main() {

  vec2 uv = gl_PointCoord - 0.5;

  float d = length(uv);

  float glow =
    smoothstep(0.5, 0.0, d);

  float core =
    smoothstep(0.15, 0.0, d);

  vec3 color =
    mix(
      vec3(1.0, 0.15, 0.0),
      vec3(1.0, 0.6, 0.0),
      vLife
    );

  color += core * vec3(1.0, 0.9, 0.5);

  float alpha =
    glow * 0.9;

  gl_FragColor =
    vec4(
      color * 5.0,
      alpha
    );
}
`
    });

  }, []);

  useFrame(() => {

    const pos =
      geometry.attributes.position.array;

    const life =
      geometry.attributes.life.array;

    let count = 0;

    for (const p of sparkParticles) {

      if (count >= MAX) break;

      const i3 = count * 3;

      pos[i3] = p.x;
      pos[i3 + 1] = p.y;
      pos[i3 + 2] = 0;

      life[count] = p.life;

      count++;
    }

    geometry.setDrawRange(0, count);

    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.life.needsUpdate = true;

  });

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}