// ecs/content/weapons.js

import { spawnBullet, spawnChargeBeam, spawnMissile } from '../spawn';
import { findNearestAsteroid } from '../shared/findNearestAsteroid';

const SHIP_MUZZLE_OFFSET = 1.10;

export const weapons = {

  raygun: {

    hotkey: 'Digit1',
    cooldown: 0.20, // delay between bullets

    fire(ship) {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,

        speed: 20,

        colorR: 0,
        colorG: 1,
        colorB: 1,
      });
    }
  },

  shotgun: {

    hotkey: 'Digit2',
    cooldown: 0.7,

    fire(ship) {

      for (let i = -2; i <= 2; i++) {

        spawnBullet({

          x: ship.x,
          y: ship.y,

          rotation: ship.rotation + i * 0.15,
          muzzleOffset: SHIP_MUZZLE_OFFSET,
          speed: 18,

          colorR: 1,
          colorG: 0,
          colorB: 0
        });
      }
    }
  },

  machinegun: {

    hotkey: 'Digit3',
    cooldown: 0.05,

    fire(ship) {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,

        speed: 25,

        colorR: 1,
        colorG: 0,
        colorB: 1,

      });
    }
  },

  // adding a new weapon copy paste:

  plasma: {
    hotkey: 'Digit4',
    cooldown: 0.03,
    fire(ship) {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,

        speed: 30,

        colorR: 0,
        colorG: 1,
        colorB: 0,

        glow: 3,
        length: 2,
        rainbow: true,
      });
    }
  },

  flamethrower: {
    hotkey: 'Digit5',
    cooldown: 0.01,

    fire(ship) {

      spawnBullet({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,

        speed: 40,

        colorR: 1,
        colorG: 0,
        colorB: 0,

        glow: 3,
        length: 2
      });
    }
  },

  chargegun: {
    hotkey: 'Digit6',
    cooldown: 0,

    release(ship, chargeTime) {

      const charge = Math.min(chargeTime, 3);

      spawnChargeBeam({

        x: ship.x,
        y: ship.y,

        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,

        damage: 200 + charge * 800,
        length: 6 + charge * 25,
        width: 0.3 + charge * 1.8,
        glow: 3 + charge * 4
      });
    }
  },

  missilegun: {

  hotkey: 'Digit7',

  cooldown: 0.35,

  fire(ship) {

    const target = findNearestAsteroid(ship.x, ship.y);
    if (!target) return;

    spawnMissile({
      x: ship.x,
      y: ship.y,
      rotation: ship.rotation,
      muzzleOffset: SHIP_MUZZLE_OFFSET,
      target
    });
  }
},

};