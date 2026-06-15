// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { bullets } from '../ecs/core/queries';

const MAX = 12000;

export default function BulletRenderer() {

  const meshRef = useRef();
  const geometry = useMemo(() => {

    const geo = new THREE.InstancedBufferGeometry();
    const plane = new THREE.PlaneGeometry(1, 1);

    geo.index = plane.index;
    geo.attributes.position = plane.attributes.position;
    geo.attributes.uv = plane.attributes.uv;

    // instance data
    const offsets = new Float32Array(MAX * 3);
    const colors = new Float32Array(MAX * 3);
    const lengths = new Float32Array(MAX);
    const widths = new Float32Array(MAX);
    const glows = new Float32Array(MAX);
    const forwards = new Float32Array(MAX * 2);
    // for plasma gun
    const rainbows = new Float32Array(MAX);

    const offsetAttr = new THREE.InstancedBufferAttribute(offsets, 3);
    offsetAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('offset', offsetAttr);

    const instanceColorAttr = new THREE.InstancedBufferAttribute(colors, 3);
    instanceColorAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('instanceColor', instanceColorAttr);

    const bulletLength = new THREE.InstancedBufferAttribute(lengths, 1);
    bulletLength.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletLength', bulletLength);

    const bulletWidth = new THREE.InstancedBufferAttribute(widths, 1);
    bulletWidth.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletWidth', bulletWidth);

    const bulletGlow = new THREE.InstancedBufferAttribute(glows, 1);
    bulletGlow.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('bulletGlow', bulletGlow);

    const forwardAttr = new THREE.InstancedBufferAttribute(forwards, 2);
    forwardAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('forward', forwardAttr);

    const rainbowAttr =
      new THREE.InstancedBufferAttribute(
        rainbows,
        1
      );

    rainbowAttr.setUsage(
      THREE.DynamicDrawUsage
    );

    geo.setAttribute(
      'rainbow',
      rainbowAttr
    );

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      toneMapped: false,
      uniforms: { uTime: { value: 0 } },

      vertexShader: `

        attribute vec3 offset;
        attribute vec2 forward;
        attribute vec3 instanceColor;
        attribute float rainbow;

        varying vec2 vUv;
        varying vec3 vColor;
        varying float vRainbow;

        attribute float bulletLength;
        attribute float bulletWidth;

        varying float vGlow;
        attribute float bulletGlow;

        void main() {

          vUv = uv;
          vColor = instanceColor;
          vGlow = bulletGlow;
          vec3 pos = position;
          vRainbow = rainbow;

          vec2 side = vec2(-forward.y, forward.x);

          float f = position.y * bulletLength;
          float s = position.x * bulletWidth;

          pos.xy = forward * -f + side * s;

          // world position
          pos += offset;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,

      fragmentShader: `

      vec3 rainbowColor(float t) {

    return vec3(
        sin(t) * 0.5 + 0.5,
        sin(t + 2.094) * 0.5 + 0.5,
        sin(t + 4.188) * 0.5 + 0.5
    );
}

      uniform float uTime;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vGlow;
        varying float vRainbow;

       void main() {

    // x = width axis
    // y = travel axis
    float x = abs(vUv.x - 0.5);

    // flip so 0 = rear, 1 = front
    float y = 1.0 - vUv.y;

    // bulbous front
    float width =
        mix(
            0.01,   // rear point
            0.28,   // front width
            pow(y, 0.45)
        );

    // main shape
    float body =
        1.0 -
        smoothstep(
            width,
            width + 0.03,
            x
        );

    // rounded nose
    float nose =
        1.0 -
        smoothstep(
            0.0,
            0.35,
            distance(
                vec2(vUv.x, vUv.y),
                vec2(0.5, 0.95)
            )
        );

    body = max(body, nose);

    // bright center
    float core =
        1.0 -
        smoothstep(
            width * 0.2,
            width * 0.7,
            x
        );

    // glow
    float glow =
        1.0 -
        smoothstep(
            width,
            width * 2.5,
            x
        );

vec3 baseColor = vColor;

if(vRainbow > 0.5) {

    baseColor =
        rainbowColor(
            uTime * 8.0
            + vUv.y * 8.0
        );
}

vec3 color =
      baseColor * glow * 2.0
    + vec3(2.5) * core;

    float alpha =
          body * 0.85
        + glow * 0.25;

    alpha *= vGlow;

    if(alpha < 0.01)
        discard;

    gl_FragColor = vec4(color, alpha);

        }
      `
    });

  }, []);

  const arrays = useMemo(() => ({

    offsets: geometry.attributes.offset.array,
    colors: geometry.attributes.instanceColor.array,
    lengths: geometry.attributes.bulletLength.array,
    widths: geometry.attributes.bulletWidth.array,
    glows: geometry.attributes.bulletGlow.array,
    forwards: geometry.attributes.forward.array,
    rainbows: geometry.attributes.rainbow.array

  }), [geometry]);

  useFrame((state) => {

    material.uniforms.uTime.value = state.clock.elapsedTime;

    const { offsets, colors, lengths, widths, glows, forwards, rainbows } = arrays;

    let count = 0;

    for (const bullet of bullets) {

      if (count >= MAX) break;

      const i3 = count * 3;

      offsets[i3 + 0] = bullet.x;
      offsets[i3 + 1] = bullet.y;
      offsets[i3 + 2] = 0;

      const i2 = count * 2;

      forwards[i2 + 0] = Math.cos(bullet.rotation);
      forwards[i2 + 1] = Math.sin(bullet.rotation);

      colors[i3 + 0] = bullet.colorR ?? 1;
      colors[i3 + 1] = bullet.colorG ?? 1;
      colors[i3 + 2] = bullet.colorB ?? 1;

      lengths[count] = bullet.length ?? 1;
      widths[count] = bullet.width ?? 1;
      glows[count] = bullet.glow ?? 1;
      rainbows[count] = bullet.rainbow ? 1 : 0;

      count++;
    }

    geometry.instanceCount = count;

    geometry.attributes.offset.needsUpdate = true;
    geometry.attributes.instanceColor.needsUpdate = true;
    geometry.attributes.bulletLength.needsUpdate = true;
    geometry.attributes.bulletWidth.needsUpdate = true;
    geometry.attributes.bulletGlow.needsUpdate = true;
    geometry.attributes.forward.needsUpdate = true;
    geometry.attributes.rainbow.needsUpdate = true;

  });

  return (
    <mesh ref={meshRef} geometry={geometry} material={material} />
  );
}
