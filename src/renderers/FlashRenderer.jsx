// src/renderers/FlashRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { flashParticles } from '../ecs/core/queries';

const MAX_FLASHES = 1000;

const vertexShader = `
  attribute vec3 instanceColor;
  varying vec3 vColor;

  void main() {
    vColor = instanceColor;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;

  void main() {
    vec3 color = vColor * 2.0 + vec3(1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FlashRenderer() {

  const meshRef = useRef();

  const dummy = useMemo(
    () => new THREE.Object3D(), []);

  const geometry = useMemo(() => {

    const geo = new THREE.BufferGeometry();

   const vertices = new Float32Array([

  // north
   0.0,  2.5, 0,
  -0.2,  0.4, 0,
   0.2,  0.4, 0,

  // south
   0.0, -2.5, 0,
  -0.2, -0.4, 0,
   0.2, -0.4, 0,

  // east
   2.5,  0.0, 0,
   0.4, -0.2, 0,
   0.4,  0.2, 0,

  // west
  -2.5,  0.0, 0,
  -0.4, -0.2, 0,
  -0.4,  0.2, 0,

  // NE
   1.8,  1.8, 0,
   0.25, 0.0, 0,
   0.0,  0.25, 0,

  // NW
  -1.8,  1.8, 0,
  -0.25, 0.0, 0,
   0.0,  0.25, 0,

  // SE
   1.8, -1.8, 0,
   0.25, 0.0, 0,
   0.0, -0.25, 0,

  // SW
  -1.8, -1.8, 0,
  -0.25, 0.0, 0,
   0.0, -0.25, 0,

  // center quad
  -0.6, -0.6, 0,
   0.6, -0.6, 0,
   0.6,  0.6, 0,

  -0.6, -0.6, 0,
   0.6,  0.6, 0,
  -0.6,  0.6, 0,

]);

    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );

    const colors = new Float32Array(MAX_FLASHES * 3);

    geo.setAttribute(
      'instanceColor',
      new THREE.InstancedBufferAttribute(colors, 3)
    );

    return geo;

  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      vertexShader,
      fragmentShader,

      transparent: true,
      depthWrite: false,

      blending: THREE.AdditiveBlending,

    });

  }, []);

  useFrame(() => {

    if (!meshRef.current) return;

    const colorAttr =
      geometry.getAttribute('instanceColor');

    let count = 0;

    for (const flash of flashParticles) {

      if (count >= MAX_FLASHES) break;

      const scale =
        (flash.size ?? 1) *
        Math.max(flash.life ?? 1, 0.05);

      dummy.position.set(
        flash.x,
        flash.y,
        0
      );

      dummy.rotation.set(
        0,
        0,
        flash.rotation - Math.PI * 0.5
      );

      dummy.scale.set(
        scale,
        scale,
        1
      );

      dummy.updateMatrix();

      meshRef.current.setMatrixAt(
        count,
        dummy.matrix
      );

      colorAttr.setXYZ(
        count,
        flash.colorR ?? 1,
        flash.colorG ?? 1,
        flash.colorB ?? 1
      );

      count++;
    }

    meshRef.current.count = count;
    meshRef.current.instanceMatrix.needsUpdate = true;
    colorAttr.needsUpdate = true;

  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        geometry,
        material,
        MAX_FLASHES
      ]}
      frustumCulled={false}
    />
  );
}