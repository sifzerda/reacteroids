// src/renderers/BeamRenderer.jsx

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { beams } from '../ecs/core/queries';

const MAX = 100;

export default function BeamRenderer() {

  const geometry = useMemo(() => {

    const geo = new THREE.InstancedBufferGeometry();
    const plane = new THREE.PlaneGeometry(1, 1);

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    const offsets = new Float32Array(MAX * 3);
    const forwards = new Float32Array(MAX * 2);
    const lengths = new Float32Array(MAX);
    const widths = new Float32Array(MAX);
    const colors = new Float32Array(MAX * 3);
    const types = new Float32Array(MAX);

    geo.setAttribute('offset', new THREE.InstancedBufferAttribute(offsets, 3));
    geo.setAttribute('forward', new THREE.InstancedBufferAttribute(forwards, 2));
    geo.setAttribute('beamLength', new THREE.InstancedBufferAttribute(lengths, 1));
    geo.setAttribute('beamWidth', new THREE.InstancedBufferAttribute(widths, 1));
    geo.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colors, 3));
    geo.setAttribute('beamType', new THREE.InstancedBufferAttribute(types, 1));

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,

      uniforms: {uTime: { value: 0 }},

      vertexShader: `

attribute vec3 offset;
attribute vec2 forward;

attribute float beamLength;
attribute float beamWidth;

attribute vec3 instanceColor;
attribute float beamType;

varying vec2 vUv;
varying vec3 vColor;
varying float vBeamType;

void main() {

vUv = uv;
vColor = instanceColor;
vBeamType = beamType;

  vec2 side = vec2(-forward.y, forward.x);

  vec3 pos = position;

  pos.x *= beamLength;
  pos.y *= beamWidth;

  pos.x += beamLength * 0.5;
  pos.xy = forward * pos.x + side * pos.y;

  pos += offset;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,

      fragmentShader: `

uniform float uTime;

varying vec2 vUv;
varying vec3 vColor;
varying float vBeamType;

void main() {

  float beamOffset = 0.0;

  // Ion beam wiggle
  if (vBeamType > 0.5 && vBeamType < 1.5) {
    beamOffset = sin(vUv.x * 80.0 + uTime * 40.0) * 0.18;
  }

  float y = abs(vUv.y - 0.5 + beamOffset);
  float core = 1.0 - smoothstep( 0.0, 0.08, y);
  float glow = 1.0 - smoothstep(0.0, 0.45, y);

  // Laser beam
  if (vBeamType < 0.5) {
    glow *= 0.25;
  }

  // Charge beam
  if (vBeamType > 1.5) {
    glow *= 2.5;
    core *= 2.0;
  }

  float pulse = 0.8 + 0.2 * sin(uTime * 25.0 + vUv.x * 30.0);

  vec3 color = vColor * glow * 4.0 * pulse + vec3(4.0) * core;

  float alpha = glow * pulse;
  if(alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`
    });

  }, []);

  const arrays = useMemo(() => ({

    offsets: geometry.attributes.offset.array,
    forwards: geometry.attributes.forward.array,
    lengths: geometry.attributes.beamLength.array,
    widths: geometry.attributes.beamWidth.array,
    colors: geometry.attributes.instanceColor.array,
    types: geometry.attributes.beamType.array,

  }), [geometry]);

  useFrame((state) => {

    material.uniforms.uTime.value = state.clock.elapsedTime;

    const {
      offsets,
      forwards,
      lengths,
      widths,
      colors,
      types,
    } = arrays;

    let count = 0;

    for (const beam of beams) {

      if (count >= MAX) break;

      const i3 = count * 3;
      const i2 = count * 2;

      offsets[i3 + 0] = beam.x;
      offsets[i3 + 1] = beam.y;
      offsets[i3 + 2] = 0;

      forwards[i2 + 0] = Math.cos(beam.rotation);
      forwards[i2 + 1] = Math.sin(beam.rotation);

      lengths[count] = beam.length ?? 10;
      widths[count] = beam.width ?? 1;

      colors[i3 + 0] = beam.colorR ?? 0;
      colors[i3 + 1] = beam.colorG ?? 1;
      colors[i3 + 2] = beam.colorB ?? 1;

      types[count] = beam.beamType === 'ion' ? 1 : beam.beamType === 'charge' ? 2 : 0;

      count++;
    }

    geometry.instanceCount = count;

    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.forward.needsUpdate = true;
    geometry.attributes.beamLength.needsUpdate = true;
    geometry.attributes.beamWidth.needsUpdate = true;
    geometry.attributes.instanceColor.needsUpdate = true;
    geometry.attributes.beamType.needsUpdate = true;
  });

  return (
    <mesh
      geometry={geometry}
      material={material}
      frustumCulled={false}
    />
  );
}