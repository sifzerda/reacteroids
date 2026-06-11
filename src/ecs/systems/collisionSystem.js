// src/ecs/systems/collisionSystem.js

import { bullets, asteroids } from '../core/queries';
import { world } from '../core/world';
import { gameState } from '../core/gameState';
import { destroyAsteroid } from '../shared/destroyAsteroid';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < bullet.radius + asteroid.radius) {

        world.remove(bullet);
        destroyAsteroid(asteroid, 100);

        break;
      }
    }
  }
}