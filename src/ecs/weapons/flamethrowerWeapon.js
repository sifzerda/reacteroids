// src/ecs/weapons/flamethrowerWeapon.js

import { spawnExhaustParticle }
  from '../factories/spawnExhaustParticle.js';

export const flamethrowerWeapon = {

  cooldown: 0.01,

  fire(ship) {

    const muzzle = 1.7;

    for (let i = 0; i < 8; i++) {

      const angle =
        ship.rotation +
        (Math.random() - 0.5) * 0.6;

      const speed =
        6 + Math.random() * 6;

      spawnExhaustParticle({

        x:
          ship.x +
          Math.cos(ship.rotation) * muzzle,

        y:
          ship.y +
          Math.sin(ship.rotation) * muzzle,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        colorR: 2.0,
        colorG: 0.5,
        colorB: 0.0,
      });
    }
  },
};