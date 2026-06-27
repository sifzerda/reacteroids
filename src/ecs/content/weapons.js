// ecs/content/weapons.js

import { spawnBullet, spawnBeam, spawnMissile, spawnSpark } from '../spawn';
import { findNearestAsteroid } from '../shared/spatialGrid';
import { sparkParticles, exhaustParticles } from '../core/queries';

export const weapons = {

  /*
  -------------------------------------------------
  RAY GUN
  -------------------------------------------------
  */

  raygun: {

    hotkey: 'Digit1',
    cooldown: 0.20, // delay between bullets

    fire(ship, muzzleX, muzzleY) {

      spawnBullet({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
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

    fire(ship, muzzleX, muzzleY) {

      for (let i = -2; i <= 2; i++) {

        spawnBullet({
          x: muzzleX,
          y: muzzleY,
          rotation: ship.rotation + i * 0.15,
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

    fire(ship, muzzleX, muzzleY) {

      spawnBullet({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        speed: 25,
        colorR: 1,
        colorG: 0,
        colorB: 1,
      });
    }
  },

  /*
  -------------------------------------------------
  PLASMA TORCH
  -------------------------------------------------
  */

  plasmatorch: {

    hotkey: 'Digit4',
    cooldown: 0.03,

    fire(ship, muzzleX, muzzleY) {

      spawnBullet({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
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

    fire(ship, muzzleX, muzzleY) {

      spawnBullet({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
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
  MISSILE GUN 
  -------------------------------------------------
  */

  missilelauncher: {

    hotkey: 'Digit6',
    cooldown: 0.35,

    fire(ship, muzzleX, muzzleY) {

      const target = findNearestAsteroid(ship.x, ship.y);
      if (!target) return;

      spawnMissile({
        x: muzzleX,
        y: muzzleY,
        rotation: ship.rotation,
        target
      });
    }
  },

  /*
  -------------------------------------------------
  LASER BEAM (special case)
  -------------------------------------------------
  */

  laserbeam: {

    hotkey: 'Digit7',

    fire(ship, muzzleX, muzzleY) {

      spawnBeam({
        beamType: 'laser',
        x: muzzleX,
        y: muzzleY,
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

};