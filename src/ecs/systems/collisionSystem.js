// src/ecs/systems/collisionSystem.js

import { bullets, asteroids } from '../queries';
import { world } from '../world';
import { spawnAsteroid } from '../factories/spawnAsteroid';
import { gameState } from '../gameState';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;

      const dist =
        Math.sqrt(dx * dx + dy * dy);

      if (
        dist <
        bullet.radius + asteroid.radius
      ) {

        world.remove(bullet);
        world.remove(asteroid);

        gameState.score += 100;

        // fill bomb meter on EVERY hit
        gameState.bombCharge += 15;
        if (
          gameState.bombCharge >= gameState.bombChargeRequired
        ) {
          gameState.bombCharge = gameState.bombChargeRequired;
          gameState.bombReady = true;
        }

        // ONLY count full asteroid kills
        if (asteroid.size === 3) {

          gameState.asteroidsDestroyed++;

          // advance wave
          if (
            gameState.asteroidsDestroyed >=
            gameState.asteroidsRequired
          ) {

            gameState.wave++;

            gameState.asteroidsDestroyed = 0;

            gameState.asteroidsRequired =
              5 + (gameState.wave - 1);
          }
        }

        // Split asteroids

        if (asteroid.size > 1) {

          for (let i = 0; i < 2; i++) {

            const angle =
              Math.random() *
              Math.PI *
              2;

            const speed =
              1 + Math.random() * 2;

            spawnAsteroid({

              x: asteroid.x,
              y: asteroid.y,

              vx:
                Math.cos(angle) * speed,

              vy:
                Math.sin(angle) * speed,

              radius:
                asteroid.radius * 0.6,

              size:
                asteroid.size - 1,
            });
          }
        }

        break;
      }
    }
  }
}