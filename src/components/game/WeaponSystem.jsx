// components/WeaponSystem.js

import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function WeaponSystem({ shipDataRef, bulletsRef, fxRef }) {
  const keys = useRef({});
  const currentWeapon = useRef(1);
  const cooldown = useRef(0);

  const tempForward = useMemo(() => new THREE.Vector3(), []);
  const tempSpawn = useMemo(() => new THREE.Vector3(), []);
  const tempDir = useMemo(() => new THREE.Vector3(), []);
  const axisZ = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  useEffect(() => {
    const down = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }

      keys.current[e.code] = true;

      if (
        [
          'Digit1',
          'Digit2',
          'Digit3',
          'Digit4',
        ].includes(e.code)
      ) {
        currentWeapon.current = Number(e.code.replace('Digit', ''));
      }
    };

    const up = (e) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);

      window.removeEventListener('keyup', up);
    };
  }, []);

  const WEAPONS = {
    1: {
      fireRate: 0.12,
      bulletCount: 1,
      spread: 0,
      speed: 18,
      color: '#ff66ff',
      damage: 100,
      muzzleOffset: 1.8,
    },

    2: {
      fireRate: 0.25,
      bulletCount: 5,
      spread: 0.25,
      speed: 16,
      color: '#ffaa33',
      damage: 70,
      muzzleOffset: 1.8,
    },

    3: {
      fireRate: 0.05,
      bulletCount: 1,
      spread: 0,
      speed: 20,
      color: '#ffffff',
      damage: 40,
      muzzleOffset: 2.1,
    },

    4: {
      fireRate: 0.35,
      bulletCount: 1,
      spread: 0,
      speed: 10,
      color: '#00ffff',
      damage: 250,
      muzzleOffset: 1.4,
    },
  };

  useFrame((_, delta) => {
    cooldown.current += delta;

    if (
      !shipDataRef?.current ||
      !bulletsRef?.current
    ) {
      return;
    }

    const ship = shipDataRef.current;

    if (!ship?.mesh) {
      return;
    }

    const weapon = WEAPONS[currentWeapon.current];

    if (keys.current['Space'] && cooldown.current >= weapon.fireRate) {
      cooldown.current = 0;

      tempForward
        .set(0, 1, 0)
        .applyEuler(ship.rotation);

      tempSpawn
        .copy(ship.position)
        .addScaledVector(
          tempForward,
          weapon.muzzleOffset
        );

      for (let i = 0; i < weapon.bulletCount; i++) {
        const angleOffset = (i - (weapon.bulletCount - 1) / 2) * weapon.spread;

        tempDir
          .copy(tempForward)
          .applyAxisAngle(
            axisZ,
            angleOffset
          );

        bulletsRef.current.spawn({
          position: tempSpawn,
          direction: tempDir,
          speed: weapon.speed,
          life: 1.2,
          color: weapon.color,
          damage: weapon.damage,
        });
      }

      fxRef?.current?.muzzleFlash?.(tempSpawn, weapon.color);
    }
  });

  return null;
}