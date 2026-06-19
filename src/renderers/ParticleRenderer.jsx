// src/ecs/renderers/ParticleRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { particles } from '../ecs/core/queries';

const MAX = 30000;
// GPU shader based particle system
export default function ParticleRenderer() {

  const { size } = useThree();

  const STRIDE = 10;

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();
    const data = new Float32Array(MAX * STRIDE);
    const interleaved = new THREE.InterleavedBuffer(data, STRIDE);

    interleaved.setUsage(THREE.DynamicDrawUsage);

    geo.setAttribute('position', new THREE.InterleavedBufferAttribute(interleaved, 3, 0));
    geo.setAttribute('life', new THREE.InterleavedBufferAttribute(interleaved, 1, 3));
    geo.setAttribute('size', new THREE.InterleavedBufferAttribute(interleaved, 1, 4));
    geo.setAttribute('type', new THREE.InterleavedBufferAttribute(interleaved, 1, 5));
    geo.setAttribute('particleColor', new THREE.InterleavedBufferAttribute(interleaved, 3, 6));
    geo.setAttribute('seed', new THREE.InterleavedBufferAttribute(interleaved, 1, 9));

    geo.userData.interleaved = interleaved;

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: false,
      toneMapped: false,

      vertexShader: `

attribute float life;
attribute float size;
attribute float type;
attribute float seed;
attribute vec3 particleColor;

varying float vLife;
varying float vType;
varying float vSeed;
varying vec3 vParticleColor;

void main() {

  vLife = life;
  vType = type;
  vParticleColor = particleColor;
  vSeed = seed;

  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float particleSize = size;

  //
  // Smoke grows dramatically
  //

  if (type > 0.5 && type < 1.5) {
    particleSize *= mix(0.5, 5.0, 1.0 - life);
  }

  //
  // Muzzle flash shrinks
  //

  else if (type > 2.5) {
    particleSize *= mix(3.0, 0.2, 1.0 - life);
  }

  //
  // Perspective scaling
  //

  particleSize *= 300.0 / max(1.0, -mv.z);

  gl_PointSize = particleSize;
  gl_Position = projectionMatrix * mv;
}
      `,

      fragmentShader: `

varying float vLife;
varying float vType;
varying vec3 vParticleColor;
varying float vSeed;

float hash(vec2 p) {

  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {

  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
}

void main() {

  vec2 uv = gl_PointCoord - 0.5;

  vec2 shapedUV = uv;

  //
  // Exhaust flame shape
  //

  if (vType < 0.5) {

    shapedUV.y *= 2.8;
    shapedUV.x += sin( uv.y * 18.0) * 0.05;
  }

  float d = length(shapedUV);
  float circle = smoothstep(0.55, 0.0, d);
  float core = smoothstep(0.15, 0.0, d);

  float halo = smoothstep(0.9, 0.0, d);

vec3 particleCol;
  float alpha;

 if(vType < 0.5)
{
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    return;
}

if(vType < 1.5)
{
    gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    return;
}

if(vType < 2.5)
{
    gl_FragColor = vec4(0.0,0.0,1.0,1.0);
    return;
}

gl_FragColor = vec4(1.0,1.0,0.0,1.0);

}
      `
    });

  }, [size.height]);

  const interleaved = geometry.userData.interleaved;

  useFrame(() => {

    const data =
      interleaved.array;

    let count = 0;

    for (const p of particles) {

      if (count < 10) {
  console.log(
    'type:',
    p.particleType
  );
}

      if (count >= MAX)
        break;

      const base =
        count * STRIDE;

      data[base + 0] =
        p.x;

      data[base + 1] =
        p.y;

      data[base + 2] =
        0;

      data[base + 3] =
        p.life ?? 1;

      data[base + 4] =
        p.size ?? 8;

      data[base + 5] =
        p.particleType ?? 0;

      data[base + 6] =
        p.colorR ?? 1;

      data[base + 7] =
        p.colorG ?? 1;

      data[base + 8] =
        p.colorB ?? 1;

      data[base + 9] =
        p.seed ?? 0;

      count++;
    }

    geometry.setDrawRange(
      0,
      count
    );

    interleaved.needsUpdate =
      true;

  });

  return (
    <points
      geometry={geometry}
      material={material}
    //  frustumCulled={false}
    />
  );
}