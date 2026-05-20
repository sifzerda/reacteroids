// src/ecs/systems/weaponSystem.js

import { ships } from '../queries';
import { keys } from '../input';
import { spawnBullet } from '../factories/spawnBullet';

export function weaponSystem(delta) {
  for (const ship of ships) {

    ship.cooldown -= delta;

    if (
      keys['Space'] &&
      ship.cooldown <= 0
    ) {
      ship.cooldown = 0.15;

      const muzzleDistance = 0.7;

      spawnBullet({
        x:
          ship.x +
          Math.cos(ship.rotation) * muzzleDistance,

        y:
          ship.y +
          Math.sin(ship.rotation) * muzzleDistance,

        rotation: ship.rotation,
      });
    }
  }
}