// src/ecs/systems/collisionSystem.js

import { bullets, asteroids }
  from '../queries';

import { world }
  from '../world';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx =
        asteroid.x - bullet.x;

      const dy =
        asteroid.y - bullet.y;

      const distSq =
        dx * dx + dy * dy;

      const radius =
        asteroid.radius + 0.15;

      if (
        distSq <
        radius * radius
      ) {

        asteroid.health -= 50;

        world.remove(bullet);

        if (
          asteroid.health <= 0
        ) {
          world.remove(asteroid);
        }

        break;
      }
    }
  }
}