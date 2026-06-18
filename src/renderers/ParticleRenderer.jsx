// src/ecs/renderers/ParticleRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { particles } from '../ecs/core/queries';

const MAX = 30000;
// GPU shader based particle system
export default function ParticleRenderer() {

  const { size } = useThree();

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MAX * 3), 3));
    geo.setAttribute('life', new THREE.BufferAttribute(new Float32Array(MAX), 1));
    geo.setAttribute('size', new THREE.BufferAttribute(new Float32Array(MAX), 1));
    geo.setAttribute('type', new THREE.BufferAttribute(new Float32Array(MAX), 1));

    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.type.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.life.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.size.setUsage(THREE.DynamicDrawUsage);

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      toneMapped: false,

      vertexShader: `

attribute float life;
attribute float size;
attribute float type;

varying float vLife;
varying float vType;

void main() {

  vLife = life;
  vType = type;

  vec4 mv = modelViewMatrix * vec4(position,1.0);

float particleSize = size;

// Smoke grows as it ages
if (type > 0.5 && type < 1.5) {

  particleSize *=
    mix(
      0.6,
      4.0,
      1.0 - life
    );
}

// Muzzle flashes start huge and shrink
else if (type > 2.5) {
  particleSize *= mix(2.5, 0.3, 1.0 - life);
}

  gl_PointSize = particleSize;
  gl_Position = projectionMatrix * mv;
}
      `,

      fragmentShader: `

      varying float vLife;
varying float vType;

void main() {

  vec2 uv = gl_PointCoord - 0.5;

  vec2 shapedUV = uv;

if (vType < 0.5) {

  shapedUV.y *= 2.5;
}

float d =
  length(shapedUV);

  float circle = smoothstep(0.5, 0.0, d);
  float core = smoothstep(0.15, 0.0, d);

  vec3 color;
  float alpha = circle;

  //
  // EXHAUST
  //

  if (vType < 0.5) {

    float heat = 1.0 - vLife;

    vec3 blue = vec3(0.05, 0.45, 2.5);
    vec3 purple = vec3(0.5, 0.1, 1.4);
    vec3 orange = vec3(1.2, 0.25, 0.05);

    color = mix(blue, purple, smoothstep(0.0, 0.5, heat));
    color = mix(color, orange, smoothstep(0.4, 1.0, heat));

    color +=
      core *
      vec3(
        2.0,
        2.0,
        2.0
      ) *
      0.5;

alpha *=
  smoothstep(
    0.0,
    0.15,
    vLife
  ) *
  1.4;

  }

  //
  // SMOKE
  //

  else if (vType < 1.5) {

    float puff =
      smoothstep(
        0.55,
        0.0,
        d
      );

      float inner = 
      smoothstep(
        0.25,
        0.0,
        d
      );

    float edge =
      smoothstep(
        0.25,
        0.0,
        d
      );

 color =
    mix(
      vec3(0.7),
      vec3(1.0),
      inner
    );

  alpha =
    puff *
    vLife *
    0.9;
}

  //
  // SPARKS
  //

  else if (vType < 2.5) {

float glow =

  smoothstep(
    0.45,
    0.0,
    abs(uv.x)
  ) *

  smoothstep(
    0.18,
    0.0,
    abs(uv.y)
  );

    color =
      mix(
        vec3(
          1.0,
          0.05,
          0.0
        ),
        vec3(
          1.0,
          0.7,
          0.0
        ),
        vLife
      );

    color +=
      core *
      vec3(
        1.0,
        0.95,
        0.7
      );

alpha =
  glow *
  vLife *
  2.0;
  
  }

  //
  // MUZZLE FLASH
  //

else {

  float burst =
    smoothstep(
      0.6,
      0.0,
      d
    );

  color =
    mix(
      vec3(
        1.0,
        0.35,
        0.0
      ),
      vec3(
        3.0,
        2.5,
        1.0
      ),
      core
    );

  alpha =
    burst *
    vLife *
    3.5;
}

  gl_FragColor =
    vec4(
      color * 10.0,
      alpha
    );
}
      `
    });

  }, [size.height]);

  const positionAttr = geometry.attributes.position;
  const lifeAttr = geometry.attributes.life;
  const sizeAttr = geometry.attributes.size;
  const typeAttr = geometry.attributes.type;

  useFrame(() => {

    const positions = positionAttr.array;
    const lifes = lifeAttr.array;
    const sizes = sizeAttr.array;
    const types = typeAttr.array;

    let count = 0;

    for (const p of particles) {

      if (count >= MAX) break;

      const i3 = count * 3;

      positions[i3] = p.x;
      positions[i3 + 1] = p.y;
      positions[i3 + 2] = 0;

      lifes[count] =
        p.life ?? 1;

      sizes[count] =
        p.size ?? 8;

      types[count] =
        p.particleType ?? 0;

      count++;
    }

    geometry.setDrawRange(0, count);

    positionAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;
    typeAttr.needsUpdate = true;

  });

  return (
    <points
      geometry={geometry}
      material={material}
    //  frustumCulled={false}
    />
  );
}