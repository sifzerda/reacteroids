// components/FXSystem.js

import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MAX_PARTICLES = 2000;

const FXSystem = forwardRef(function FXSystem(props, ref) {
  const pointsRef = useRef();

  const data = useRef({
    positions: new Float32Array(MAX_PARTICLES * 3),
    velocities: new Float32Array(MAX_PARTICLES * 3),
    colors: new Float32Array(MAX_PARTICLES * 3),
    life: new Float32Array(MAX_PARTICLES),
    maxLife: new Float32Array(MAX_PARTICLES),
    index: 0,

    rings: Array.from(
      { length: 64 },
      () => ({
        active: false,
        pos: new THREE.Vector3(),
        scale: 1,
        life: 0,
        maxLife: 0,
        color: new THREE.Color(),
      })
    ),

  });

  const spawnParticle = ({ position, velocity, color, life }) => {
    const idx = data.current.index;
    const i3 = idx * 3;

    data.current.positions.set([position.x, position.y, position.z], i3);
    data.current.velocities.set([velocity.x, velocity.y, velocity.z], i3);
    data.current.colors.set(color, i3);

    data.current.life[idx] = life;
    data.current.maxLife[idx] = life;
    data.current.index = (idx + 1) % MAX_PARTICLES;
  };

  useImperativeHandle(ref, () => ({
    spawnExhaust({ position, direction }) {
      spawnParticle({
        position,
        velocity: direction
          .clone()
          .multiplyScalar(3.2),
        color: [0.6, 0.9, 1.2],
        life: 0.22,
      });

      for (let i = 0; i < 4; i++) {
        spawnParticle({
          position,
          velocity: direction
            .clone()
            .multiplyScalar(2)
            .add(
              new THREE.Vector3(
                (Math.random() - 0.5) * 0.35,
                (Math.random() - 0.5) * 0.35, 0
              )
            ),
          color: [2.0, 1.2, 0.3],
          life: 0.4,
        });
      }
    },

    muzzleFlash(position, hexColor = '#ff66ff') {
      const c = new THREE.Color(hexColor);

      for (let i = 0; i < 10; i++) {
        spawnParticle({
          position,

          velocity:
            new THREE.Vector3(
              (Math.random() - 0.5) * 6,
              (Math.random() - 0.5) * 6,
              0
            ),

          color: [
            c.r * 4,
            c.g * 4,
            c.b * 4,
          ],

          life: 0.18,
        });
      }

    },

    spawnExplosionParticle({position, velocity, color, life}) {
      spawnParticle({position, velocity, color, life});
    },

    spawnShockwave(position, color = '#ffaa44') {
      const rings = data.current.rings;

      for (let i = 0; i < rings.length; i++) {
        const r = rings[i];

        if (!r.active) {
          r.active = true;
          r.pos.copy(position);
          r.scale = 0.5;
          r.life = 0.45;
          r.maxLife = 0.45;
          r.color.set(color);

          break;
        }
      }
    },

  }));

  useFrame((_, delta) => {
    const positions = data.current.positions;
    const velocities = data.current.velocities;
    const colors = data.current.colors;
    const life = data.current.life;
    const maxLife = data.current.maxLife;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (life[i] <= 0) continue;

      const i3 = i * 3;

      positions[i3 + 0] += velocities[i3 + 0] * delta;
      positions[i3 + 1] += velocities[i3 + 1] * delta;

      velocities[i3 + 0] *= 0.985;
      velocities[i3 + 1] *= 0.985;

      life[i] -= delta;

      colors[i3 + 0] *= 0.985;
      colors[i3 + 1] *= 0.975;
      colors[i3 + 2] *= 0.965;

      if (life[i] <= 0) {
        positions[i3 + 0] = 9999;
        positions[i3 + 1] = 9999;
        positions[i3 + 2] = 9999;
      }
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={MAX_PARTICLES}
          array={data.current.positions}
          itemSize={3}
        />

        <bufferAttribute
          attach="attributes-color"
          count={MAX_PARTICLES}
          array={data.current.colors}
          itemSize={3}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

export default FXSystem;