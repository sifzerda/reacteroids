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

    const muzzle = 0.8;

    laser.x = ship.x + Math.cos(ship.rotation) * muzzle;
    laser.y = ship.y + Math.sin(ship.rotation) * muzzle;

    laser.rotation = ship.rotation;
  }
}