// src/renderers/BulletRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { bullets } from '../ecs/queries';
import * as THREE from 'three';

const MAX = 2000;
const tempObj = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function BulletRenderer() {

  const meshRef = useRef();
  // Long laser streak
  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(0.45, 2.4);
  }, []);

  const colorArray = useMemo(() => new Float32Array(MAX * 3), []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      vertexShader: `

      attribute vec3 instanceColor;
      varying vec3 vColor;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vColor = instanceColor;
        vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,

      fragmentShader: `

  varying vec3 vColor;
  varying vec2 vUv;

  void main() {

    // center UV
    vec2 uv = vUv - 0.5;

      // center horizontally
  float x = (uv.x - 0.5);

      // bullet stretches vertically
  x *= 2.2;

    // stretch vertically
    uv.y *= 0.35;

        // BULLET SHAPE

  // width tapers toward rear
  float width =
    mix(
      0.02,   // tip width
      0.22,   // rear width
      1.0 - uv.y
    ); 

      // front flare
  float tip =
    smoothstep(
      0.7,
      1.0,
      uv.y
    );

    // trail taper (increase values for soft, decrease for hard)
float trail = smoothstep(1.0, 0.15, vUv.y);

    // radial glow
    float d = length(uv);

    float glow = smoothstep(0.6, 0.0, d);

    // bright core
    float core =
      smoothstep(0.12, 0.0, d);

    // combine
    float alpha = glow * trail;

    vec3 color =

      vColor * glow * 1.5 +
      vColor * core * 4.0;

    gl_FragColor =
      vec4(color, alpha);
  }
`
    });

  }, []);


  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    let i = 0;

    for (const bullet of bullets) {
      // POSITION
      tempObj.position.set(bullet.x, bullet.y, 0);

      tempObj.rotation.z = bullet.rotation - Math.PI / 2;

      // STRETCH
      tempObj.scale.set(0.22, 1.5, 1);

      tempObj.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObj.matrix);
      // COLOR
      colorArray[i * 3 + 0] = bullet.colorR ?? 1;
      colorArray[i * 3 + 1] = bullet.colorG ?? 1;
      colorArray[i * 3 + 2] = bullet.colorB ?? 1;

      i++;
    }

    mesh.geometry.attributes.instanceColor.needsUpdate = true;
    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;

  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX]}
      frustumCulled={false}
    >

      <instancedBufferAttribute
        attach="geometry-attributes-instanceColor"
        args={[colorArray, 3]}
      />

    </instancedMesh>
  );
}