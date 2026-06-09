// src/ecs/weapons/heatrayWeapon.js

import { spawnBullet } from '../factories/spawnBullet';

export const heatrayWeapon = {

     cooldown: 0.5,

  fire(ship) {

    const muzzle = 1.9;

    spawnBullet({

      x: ship.x + Math.cos(ship.rotation) * muzzle,
      y: ship.y + Math.sin(ship.rotation) * muzzle,

      rotation: ship.rotation,

      speed: 6,

      damage: 0,

      radius: 0.6,

      life: 3,

      colorR: 1.5,
      colorG: 0.2,
      colorB: 5,

      bulletType: 'laser',
    });
  },
};