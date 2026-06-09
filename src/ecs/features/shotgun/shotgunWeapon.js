// src/ecs/weapons/shotgunWeapon.js

import { spawnBullet } from '../../shared/factories/spawnBullet';

export const shotgunWeapon = {

  cooldown: 0.45,

  fire(ship) {

    const spread = 0.18;
    const muzzle = 1.9; // position of bullet emission

    for (let i = -2; i <= 2; i++) {

      spawnBullet({

        x: ship.x + Math.cos(ship.rotation) * muzzle,
        y: ship.y + Math.sin(ship.rotation) * muzzle,

        rotation: ship.rotation + i * spread,

        speed: 20,
        life: 0.45,
        radius: 0.14,

        damage: 40,

        colorR: 1,
        colorG: 0.5,
        colorB: 0,
      });
    }
  },
};