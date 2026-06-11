// src/ecs/features/lasergun/lasergunWeapon.js

import { spawnLasergun } from './spawnLasergun';
import { world } from '../../core/world';

export const lasergunWeapon = {

  id: 'laser',

  hotkey: 'Digit4',

  cooldown: 999999,

  fire(ship) {

    if (ship.laserEntity)
      return;

    ship.laserEntity = spawnLasergun({
        ship,

        length: 50,
        width: 0.12,

        damage: 200,

        colorR: 1,
        colorG: 0,
        colorB: 0,
      });
  },

  stop(ship) {

    if (!ship.laserEntity)
      return;

    world.remove(
      ship.laserEntity
    );

    ship.laserEntity = null;
  },
};