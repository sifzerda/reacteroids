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

geo.setAttribute(
  'particleColor',
  new THREE.BufferAttribute(
    new Float32Array(MAX * 3),
    3
  )
);

    geo.setAttribute(
      'seed',
      new THREE.BufferAttribute(
        new Float32Array(MAX),
        1
      )
    );



    geo.attributes.position.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.type.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.life.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.particleColor.setUsage(THREE.DynamicDrawUsage);
    geo.attributes.size.setUsage(THREE.DynamicDrawUsage);

    geo.attributes.seed.setUsage(
      THREE.DynamicDrawUsage
    );

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

  vec4 mv =
    modelViewMatrix *
    vec4(position, 1.0);

  float particleSize = size;

  //
  // Smoke grows dramatically
  //

  if (type > 0.5 && type < 1.5) {

    particleSize *=
      mix(
        0.5,
        5.0,
        1.0 - life
      );
  }

  //
  // Muzzle flash shrinks
  //

  else if (type > 2.5) {

    particleSize *=
      mix(
        3.0,
        0.2,
        1.0 - life
      );
  }

  //
  // Perspective scaling
  //

  particleSize *=
    300.0 /
    max(1.0, -mv.z);

  gl_PointSize = particleSize;

  gl_Position =
    projectionMatrix *
    mv;
}
      `,

      fragmentShader: `

varying float vLife;
varying float vType;
varying vec3 vParticleColor;
varying float vSeed;

float hash(vec2 p) {

  return fract(
    sin(
      dot(
        p,
        vec2(
          127.1,
          311.7
        )
      )
    ) *
    43758.5453123
  );
}

float noise(vec2 p) {

  vec2 i = floor(p);
  vec2 f = fract(p);

  float a = hash(i);
  float b = hash(i + vec2(1.0,0.0));
  float c = hash(i + vec2(0.0,1.0));
  float d = hash(i + vec2(1.0,1.0));

  vec2 u =
    f * f *
    (3.0 - 2.0 * f);

  return
    mix(a,b,u.x) +
    (c-a)*u.y*(1.0-u.x) +
    (d-b)*u.x*u.y;
}

void main() {

  vec2 uv =
    gl_PointCoord - 0.5;

  vec2 shapedUV = uv;

  //
  // Exhaust flame shape
  //

  if (vType < 0.5) {

    shapedUV.y *= 2.8;

    shapedUV.x +=
      sin(
        uv.y * 18.0
      ) *
      0.05;
  }

  float d =
    length(shapedUV);

  float circle =
    smoothstep(
      0.55,
      0.0,
      d
    );

  float core =
    smoothstep(
      0.15,
      0.0,
      d
    );

  float halo =
    smoothstep(
      0.9,
      0.0,
      d
    );

vec3 particleCol;
  float alpha;

  //
  // EXHAUST
  //

  if (vType < 0.5) {

    float heat =
      1.0 - vLife;

   vec3 baseColor =
  max(
    vParticleColor,
    vec3(0.01)
  );

vec3 hotColor =
  mix(
    baseColor,
    vec3(1.0,0.5,0.0),
    heat
  );

particleCol =
  mix(
    baseColor,
    hotColor,
    heat
  );

    particleCol =
      mix(
        particleCol,
        vec3(5.0),
        pow(core, 4.0)
      );

    alpha =
      circle *
      smoothstep(
        0.0,
        0.12,
        vLife
      );
  }

  //
  // SMOKE
  //

  else if (vType < 1.5) {

    float n = noise(
      uv *
      (5.0 + vSeed * 6.0)
    );

    float puff =
      smoothstep(
        0.55 + n * 0.15,
        0.0,
        d
      );

    float inner =
      smoothstep(
        0.3,
        0.0,
        d
      );

    float rim =
      smoothstep(
        0.55,
        0.15,
        d
      );

particleCol =
  mix(
    vParticleColor * 0.25,
    vParticleColor,
    inner
  );

    particleCol +=
      rim *
      0.15;

    alpha =
      puff *
      vLife *
      0.75;
  }

  //
  // SPARK
  //

  else if (vType < 2.5) {

    vec2 suv = uv;

    suv.y *= 5.0;

    float streak =
      smoothstep(
        0.18,
        0.0,
        length(suv)
      );

   particleCol =
  mix(
    vParticleColor * 0.5,
    vParticleColor,
    vLife
  );

    particleCol +=
      core *
      vec3(
        3.0,
        2.8,
        2.0
      );

    alpha =
      streak *
      vLife *
      2.0;
  }

  //
  // MUZZLE FLASH
  //

  else {

    float burst =
      smoothstep(
        0.65,
        0.0,
        d
      );

particleCol =
  mix(
    vParticleColor,
    vec3(5.0),
    core
  );

    alpha =
      burst *
      vLife *
      2.5;
  }

  alpha += halo * 0.08;

  gl_FragColor =
    vec4(
      particleCol,
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
  const particleColorAttr = geometry.attributes.particleColor;

  const seedAttr = geometry.attributes.seed;

  useFrame(() => {

    const positions = positionAttr.array;
    const lifes = lifeAttr.array;
    const sizes = sizeAttr.array;
    const types = typeAttr.array;
    const particleColors = particleColorAttr.array;
    const seeds = seedAttr.array;

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

particleColors[i3] = p.colorR ?? 1;
particleColors[i3 + 1] = p.colorG ?? 1;
particleColors[i3 + 2] = p.colorB ?? 1;

      seeds[count] =
        p.seed ??
        ((count * 16807) % 2147483647) /
        2147483647;

      count++;
    }

    geometry.setDrawRange(0, count);

positionAttr.needsUpdate = true;
lifeAttr.needsUpdate = true;
sizeAttr.needsUpdate = true;
typeAttr.needsUpdate = true;
particleColorAttr.needsUpdate = true;
seedAttr.needsUpdate = true;

  });

  return (
    <points
      geometry={geometry}
      material={material}
    //  frustumCulled={false}
    />
  );
}