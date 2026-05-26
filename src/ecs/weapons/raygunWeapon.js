// default weapon
// src/ecs/weapons/raygunWeapon.js

import { spawnBullet } from '../factories/spawnBullet';

export const raygunWeapon = {

  cooldown: 0.15,

  fire(ship) {

    const muzzle = 1.5;

    spawnBullet({

      x: ship.x + Math.cos(ship.rotation) * muzzle,
      y: ship.y + Math.sin(ship.rotation) * muzzle,

      rotation: ship.rotation,

      speed: 26,
      life: 1.5,
      radius: 0.24,

      colorR: 2,
      colorG: 0.1,
      colorB: 2.5,
    });
  },
};