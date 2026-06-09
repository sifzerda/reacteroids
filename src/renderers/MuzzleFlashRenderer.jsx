// src/renderers/MuzzleFlashRenderer.jsx

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { bullets } from '../ecs/core/queries';

const MAX = 512;

const temp = new THREE.Object3D();
const tempColor = new THREE.Color();

export default function MuzzleFlashRenderer() {

  const meshRef = useRef();

  // Track flashes
  const flashes = useRef([]);

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(1, 1);
  }, []);

  const material = useMemo(() => {

    return new THREE.ShaderMaterial({

      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
      vertexColors: true,
      side: THREE.DoubleSide,

      vertexShader: `

        attribute vec3 instanceColor;

        varying vec3 vColor;
        varying vec2 vUv;

        void main() {

          vUv = uv;
          vColor = instanceColor;

          vec4 mvPosition =
            modelViewMatrix *
            instanceMatrix *
            vec4(position, 1.0);

          gl_Position =
            projectionMatrix *
            mvPosition;
        }
      `,

      fragmentShader: `

        varying vec3 vColor;
        varying vec2 vUv;

        void main() {

          vec2 uv = vUv - 0.5;

          float d = length(uv);

          // explosive radial glow
          float glow =
            smoothstep(0.65, 0.0, d);

          // intense center
          float core =
            pow(glow, 8.0);

          // starburst spikes
          float rays =
            abs(uv.x * uv.y) * 40.0;

          rays = 1.0 / (rays + 0.08);

          float flash =
            glow +
            core * 4.0 +
            rays * 0.15;

          vec3 color =
            vColor * flash;

          float alpha =
            flash * 0.9;

          gl_FragColor =
            vec4(color, alpha);
        }
      `,
    });

  }, []);

  // detect newly spawned bullets
  const previousBulletCount = useRef(0);

  useFrame((state, delta) => {

    // NEW BULLETS = NEW FLASHES
    if (bullets.length > previousBulletCount.current) {

      for (
        let i = previousBulletCount.current;
        i < bullets.length;
        i++
      ) {

        const bullet = bullets[i];

        flashes.current.push({

          x: bullet.x,
          y: bullet.y,
          rotation: bullet.rotation,

          life: 1,
        });
      }
    }

    previousBulletCount.current = bullets.length;

    // UPDATE FLASHES
    flashes.current =
      flashes.current.filter(f => {
        f.life -= delta * 10;
        return f.life > 0;
      });

    let i = 0;

    for (const flash of flashes.current) {

      temp.position.set(
        flash.x,
        flash.y,
        0
      );

      temp.rotation.z =
        flash.rotation;

      const s =
        (1.0 - flash.life) * 2.5 + 0.5;

      temp.scale.set(
        s * 2.5,
        s * 2.5,
        1
      );

      temp.updateMatrix();

      meshRef.current.setMatrixAt(
        i,
        temp.matrix
      );

      // blue -> white -> orange
      tempColor.setRGB(
        1.5,
        0.8 + flash.life,
        0.2
      );

      meshRef.current.setColorAt(
        i,
        tempColor
      );

      i++;
    }

    meshRef.current.count = i;
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX]}
      frustumCulled={false}
      renderOrder={100}
    />
  );
}