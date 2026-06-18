// MuzzleFlashRenderer.jsx

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { muzzleFlashes } from '../ecs/core/queries';

const MAX = 512;

export default function MuzzleFlashRenderer() {

  const geometry = useMemo(() => {

    const geo = new THREE.InstancedBufferGeometry();

    const plane =
      new THREE.PlaneGeometry(1,1);

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    geo.setAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(
        new Float32Array(MAX * 3),
        3
      )
    );

    geo.setAttribute(
      'size',
      new THREE.InstancedBufferAttribute(
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

      vertexShader: `
attribute vec3 offset;
attribute float size;

varying vec2 vUv;

void main() {

vUv = uv;

vec3 pos = position;

pos.xy *= size;

pos += offset;

gl_Position =
projectionMatrix *
modelViewMatrix *
vec4(pos,1.0);

}
`,

      fragmentShader: `
varying vec2 vUv;

void main() {

vec2 uv = vUv - 0.5;

float d = length(uv);

float flash =
smoothstep(
0.5,
0.0,
d
);

vec3 color =
vec3(
1.0,
0.8,
0.2
);

gl_FragColor =
vec4(
color * flash * 4.0,
flash
);

}
`
    });

  }, []);

  useFrame(() => {

    const offsets =
      geometry.attributes.offset.array;

    const sizes =
      geometry.attributes.size.array;

    let count = 0;

    for (const p of muzzleFlashes) {

      const i3 = count * 3;

      offsets[i3] = p.x;
      offsets[i3+1] = p.y;

      sizes[count] = p.size;

      count++;
    }

    geometry.instanceCount = count;

    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;

  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}