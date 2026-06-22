// ecs/content/weapons.js

import { spawnBullet, spawnBeam, spawnMissile, spawnFlash, spawnSpark } from '../spawn';
import { findNearestAsteroid } from '../shared/findNearestAsteroid';
import { flashParticles, sparkParticles, exhaustParticles } from '../core/queries';

const SHIP_MUZZLE_OFFSET = 1.10;

// helper
function getMuzzlePosition(ship) {

  return {
    x: ship.x + Math.cos(ship.rotation) * SHIP_MUZZLE_OFFSET,
    y: ship.y + Math.sin(ship.rotation) * SHIP_MUZZLE_OFFSET,
  };
}

export const weapons = {

  /*
  -------------------------------------------------
  RAY GUN
  -------------------------------------------------
  */

  raygun: {

    hotkey: 'Digit1',
    cooldown: 0.20, // delay between bullets

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.6,

        colorR: 0,
        colorG: 1,
        colorB: 1
      });

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

  /*
  -------------------------------------------------
  SHOTGUN
  -------------------------------------------------
  */

  shotgun: {

    hotkey: 'Digit2',
    cooldown: 0.7,

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      for (let i = -2; i <= 2; i++) {

        spawnFlash({
          x: muzzleX,
          y: muzzleY,
          rotation: ship.rotation,
          size: 1.6,
          colorR: 1,
          colorG: 0,
          colorB: 0
        });

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

  /*
  -------------------------------------------------
  MACHINE GUN
  -------------------------------------------------
  */

  machinegun: {

    hotkey: 'Digit3',
    cooldown: 0.05,

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.6,
        colorR: 1,
        colorG: 0,
        colorB: 1
      });

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

  /*
  -------------------------------------------------
  PLASMA GUN
  -------------------------------------------------
  */

  plasma: {
    hotkey: 'Digit4',
    cooldown: 0.03,
    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.6,
        colorR: 0,
        colorG: 1,
        colorB: 0
      });

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

  /*
  -------------------------------------------------
  FLAMETHROWER
  -------------------------------------------------
  */

  flamethrower: {
    hotkey: 'Digit5',
    cooldown: 0.01,

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.8,
        colorR: 1,
        colorG: 0,
        colorB: 0,
      });

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

  /*
  -------------------------------------------------
  CHARGE BEAM 
  -------------------------------------------------
  */

  chargegun: {

    hotkey: 'Digit6',

    cooldown: 0,

    release(ship, chargeTime) {

      const charge = Math.min(chargeTime, 3);
      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 2.0,
        colorR: 0,
        colorG: 1,
        colorB: 1
      });

      spawnBeam({

        beamType: 'charge',

        x: ship.x + Math.cos(ship.rotation) * 1.1,
        y: ship.y + Math.sin(ship.rotation) * 1.1,

        rotation: ship.rotation,

        damage: 200 + charge * 800,
        length: 6 + charge * 25,
        width: 0.3 + charge * 1.8,

        colorR: 0,
        colorG: 1,
        colorB: 1,

        glow: 5,

        life: 0.20
      });
    }
  },

  /*
  -------------------------------------------------
  MISSILE GUN 
  -------------------------------------------------
  */

  missilegun: {

    hotkey: 'Digit7',

    cooldown: 0.35,

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);
      const target = findNearestAsteroid(ship.x, ship.y);
      if (!target) return;

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 2.5,

        colorR: 1,
        colorG: 0.6,
        colorB: 0.1
      });

      spawnMissile({
        x: ship.x,
        y: ship.y,
        rotation: ship.rotation,
        muzzleOffset: SHIP_MUZZLE_OFFSET,
        target
      });
    }
  },

  /*
  -------------------------------------------------
  LASER GUN (special case)
  -------------------------------------------------
  */

  laserGun: {

    hotkey: 'Digit8',

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.4,
        colorR: 1,
        colorG: 0,
        colorB: 0
      });

      spawnBeam({

        beamType: 'laser',

        x: ship.x + Math.cos(ship.rotation) * 1.1,
        y: ship.y + Math.sin(ship.rotation) * 1.1,

        rotation: ship.rotation,

        damage: 300,

        length: 40,

        width: 0.08,

        colorR: 1,
        colorG: 0,
        colorB: 0,

        glow: 3,

        life: 0.05
      });
    }
  },

  /*
  -------------------------------------------------
  ION GUN 
  -------------------------------------------------
  */

  ionGun: {

    hotkey: 'Digit9',

    cooldown: 0.08,

    fire(ship) {

      const { x: muzzleX, y: muzzleY } = getMuzzlePosition(ship);

      spawnFlash({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        size: 1.8,
        colorR: 0.3,
        colorG: 0.8,
        colorB: 1
      });

      spawnBeam({

        beamType: 'ion',

        x: ship.x + Math.cos(ship.rotation) * 1.1,
        y: ship.y + Math.sin(ship.rotation) * 1.1,

        rotation: ship.rotation,

        damage: 250,

        length: 35,

        width: 0.35,

        colorR: 0.3,
        colorG: 0.8,
        colorB: 1,

        glow: 5,

        life: 0.1
      });
    }
  },


  /*
  -------------------------------------------------
  0 GUN 
  -------------------------------------------------


  ionGun: {

    hotkey: 'Digit0',

    cooldown: 0.08,

    fire(ship) {

      spawnBeam({

        beamType: 'ion',

        x:
          ship.x +
          Math.cos(ship.rotation) * 1.1,

        y:
          ship.y +
          Math.sin(ship.rotation) * 1.1,

        rotation: ship.rotation,

        damage: 250,

        length: 35,

        width: 0.35,

        colorR: 0.3,
        colorG: 0.8,
        colorB: 1,

        glow: 5,

        life: 0.1
      });
    }
  },

    */

};