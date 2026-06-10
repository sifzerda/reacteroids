// src/ecs/features/lasergun/lasergunSystem.js

import { ships, lasers } from '../../core/queries';
import { keys } from '../../core/input';
import { world } from '../../core/world';

export function lasergunSystem() {

  for (const ship of ships) {

    if (
      !keys['Space'] &&
      ship.laserEntity
    ) {
      world.remove(ship.laserEntity);

      ship.laserEntity = null;
      ship.cooldown = 0;
    }
  }

  for (const laser of lasers) {

    const ship = laser.ship;

    laser.x = ship.x;
    laser.y = ship.y;
    laser.rotation = ship.rotation;
  }
}