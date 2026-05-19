// components/Ship.js

import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WORLD_SCALE = 0.5;

export default function Ship({ shipDataRef, lives, fxRef }) {
  const shipRef = useRef();
  const keys = useRef({});

  const velocity = useRef(new THREE.Vector3());
  const rotationVel = useRef(0);
  const thrustPower = useRef(0);

  const invulnerable = useRef(false);
  const hitTimer = useRef(0);

  const TURN_SPEED = 4.5;
  const TURN_SMOOTH = 8;

  const THRUST = 16 * WORLD_SCALE;
  const THRUST_RAMP = 9;

  const DRAG = 0.992;
  const MAX_SPEED = 16 * WORLD_SCALE;

  useEffect(() => {
    const handleKey = (e, down) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      keys.current[e.code] = down;
    };

    const down = (e) => handleKey(e, true);
    const up = (e) => handleKey(e, false);

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  useFrame((state, delta) => {
    if (!shipRef.current) return;

    if (lives <= 0) {
      shipRef.current.visible = false;
      return;
    }

    shipRef.current.visible = true;

    // rotation
    let targetTurn = 0;

    if (keys.current['ArrowLeft']) { targetTurn = TURN_SPEED }
    if (keys.current['ArrowRight']) { targetTurn = -TURN_SPEED }

    rotationVel.current = THREE.MathUtils.lerp(
      rotationVel.current,
      targetTurn,
      TURN_SMOOTH * delta
    );

    shipRef.current.rotation.z += rotationVel.current * delta;

    // thrust
    let targetThrust = 0;

    if (keys.current['ArrowUp']) { targetThrust = 1 }
    if (keys.current['ArrowDown']) { targetThrust = -0.6 }

    thrustPower.current = THREE.MathUtils.lerp(
      thrustPower.current,
      targetThrust,
      THRUST_RAMP * delta
    );

    const forward = new THREE.Vector3(0, 1, 0)
        .applyEuler(shipRef.current.rotation);

    velocity.current.addScaledVector( forward, thrustPower.current * THRUST * delta );

    if (thrustPower.current > 0.8) { velocity.current.addScaledVector(forward, 4 * delta);
    }

    // exhaust FX
    if (thrustPower.current > 0.1) {
      const backward = forward.clone().multiplyScalar(-1);

      fxRef.current?.spawnExhaust?.({
        position: shipRef.current.position
            .clone()
            .add(
              backward.clone()
                .multiplyScalar(0.6)
            ),

        direction: backward,
      });
    }

    // drag
    const currentDrag = thrustPower.current > 0.1
        ? 0.996
        : DRAG;

    velocity.current.multiplyScalar(currentDrag);

    // speed cap
    const speed = velocity.current.length();

    if (speed > MAX_SPEED) {
      velocity.current.lerp(
        velocity.current
          .clone()
          .setLength(MAX_SPEED),
        0.1
      );
    }

    shipRef.current.position.addScaledVector( velocity.current, delta );

    // wrap
    const limit = 9;

    if (shipRef.current.position.x > limit) { shipRef.current.position.x = -limit }
    if (shipRef.current.position.x < -limit) { shipRef.current.position.x = limit }
    if (shipRef.current.position.y > limit) { shipRef.current.position.y = -limit }
    if (shipRef.current.position.y < -limit) { shipRef.current.position.y = limit }

    // expose state
    shipDataRef.current = {
      mesh: shipRef.current,
      position: shipRef.current.position,
      rotation: shipRef.current.rotation,
      velocity: velocity.current,
      radius: 0.45,
      thrusting: thrustPower.current > 0.1,

      hit: () => {
        invulnerable.current = true;
        hitTimer.current = 1.2;
        velocity.current.multiplyScalar(0.2);
        shipRef.current.position.set(0, 0, 0);
      },
    };

    // invulnerability flash
    if (invulnerable.current) {
      hitTimer.current -= delta;

      shipRef.current.visible = Math.floor(hitTimer.current * 12) % 2 === 0;

      if (hitTimer.current <= 0) {
        invulnerable.current = false;
        shipRef.current.visible = true;
      }
    }

    // screenshake
    state.camera.position.x = (Math.random() - 0.5) * 0.01;
    state.camera.position.y = (Math.random() - 0.5) * 0.01;
  });

  return (
    <mesh ref={shipRef}>
      <coneGeometry
        args={[0.5 * WORLD_SCALE, 1.2 * WORLD_SCALE, 3]}
      />
      <meshBasicMaterial color="cyan" wireframe />
    </mesh>
  );
}