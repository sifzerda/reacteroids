// components/BulletSystem.js

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_BULLETS = 2000;
const tempObj = new THREE.Object3D();

const BulletSystem = forwardRef(function BulletSystem(props, ref) {
  const meshRef = useRef();

  const bullets = useRef(
    Array.from({ length: MAX_BULLETS }, () => ({
      active: false,
      pos: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      rotation: 0,
      life: 0,
      maxLife: 0,
      damage: 100,
      color: new THREE.Color(),
    }))
  );

  const nextIndex = useRef(0);

  const colorArray = useMemo(() => new Float32Array(MAX_BULLETS * 3),[]);
  const opacityArray = useMemo(() => new Float32Array(MAX_BULLETS),[]);
  const geometry = useMemo(() => new THREE.PlaneGeometry(0.25, 1.2),[]);

  const material = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `
          #include <common>

          attribute vec3 instanceColor;
          attribute float instanceOpacity;

          varying vec3 vInstanceColor;
          varying float vInstanceOpacity;
          `
        );

      shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          `
          #include <begin_vertex>

          vInstanceColor = instanceColor;
          vInstanceOpacity = instanceOpacity;
          `
        );

      shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `
          #include <common>

          varying vec3 vInstanceColor;
          varying float vInstanceOpacity;
          `
        );

      shader.fragmentShader = shader.fragmentShader.replace(
          '#include <color_fragment>',
          `
          diffuseColor.rgb *= vInstanceColor;
          diffuseColor.a *= vInstanceOpacity;
          `
        );
    };

    return mat;
  }, []);

  useImperativeHandle(ref, () => ({
    spawn({ position, direction, speed, life, color, damage }) {
      const idx = nextIndex.current;
      const b = bullets.current[idx];
      b.active = true;
      b.pos.copy(position);
      b.vel
        .copy(direction)
        .multiplyScalar(speed);
      b.rotation = Math.atan2( direction.y, direction.x ) - Math.PI / 2;
      b.life = life;
      b.maxLife = life;
      b.damage = damage;
      b.color.set(color);
      nextIndex.current = (idx + 1) % MAX_BULLETS;
    },

    getBullets() {
      return bullets.current;
    },
  }));

  useFrame((_, delta) => {
    const mesh = meshRef.current;

    if (!mesh) return;

    let visibleCount = 0;

    for (let i = 0; i < MAX_BULLETS; i++) {
      const b = bullets.current[i];

      if (!b.active) continue;

      b.pos.addScaledVector(b.vel, delta);

      b.life -= delta;

      if (b.life <= 0) {
        b.active = false;
        continue;
      }

      const t = b.life / b.maxLife;

      const speed =
        Math.sqrt(
          b.vel.x * b.vel.x +
          b.vel.y * b.vel.y
        );

      tempObj.position.copy(b.pos);
      tempObj.rotation.set(0, 0, b.rotation );
      tempObj.scale.set(0.35, 1 + speed * 0.12, 1);
      tempObj.updateMatrix();
      mesh.setMatrixAt(visibleCount, tempObj.matrix);

      colorArray[visibleCount * 3 + 0] = b.color.r;
      colorArray[visibleCount * 3 + 1] = b.color.g;
      colorArray[visibleCount * 3 + 2] = b.color.b;

      opacityArray[visibleCount] = t;

      visibleCount++;
    }

    mesh.count = visibleCount;
    mesh.instanceMatrix.needsUpdate = true;
    mesh.geometry.attributes.instanceColor.needsUpdate = true;
    mesh.geometry.attributes.instanceOpacity.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, MAX_BULLETS]}>
      <instancedBufferAttribute
        attach="geometry-attributes-instanceColor"
        args={[colorArray, 3]}
      />

      <instancedBufferAttribute
        attach="geometry-attributes-instanceOpacity"
        args={[opacityArray, 1]}
      />
    </instancedMesh>
  );
});

export default BulletSystem;