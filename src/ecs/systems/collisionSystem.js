// src/ecs/systems/collisionSystem.js

import {
  bullets,
  asteroids,
} from '../queries';

import { world } from '../world';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx =
        bullet.x - asteroid.x;

      const dy =
        bullet.y - asteroid.y;

      const dist =
        Math.sqrt(dx * dx + dy * dy);

      if (
        dist <
        bullet.radius +
        asteroid.radius
      ) {

        world.remove(bullet);
        world.remove(asteroid);

        break;
      }
    }
  }
}