// ecs/content/weapons.js

import { spawnBullet } from '../spawn';

const SHIP_MUZZLE_OFFSET = 0.65;

export const weapons = {

  raygun: {

    hotkey: 'Digit1',
    cooldown: 0.20,

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
        colorG: 1,
        colorB: 0,
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
        length: 2
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

};