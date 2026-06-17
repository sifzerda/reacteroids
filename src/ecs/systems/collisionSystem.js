// src/ecs/systems/collisionSystem.js

import { bullets, asteroids, beams, missiles } from '../core/queries';
import { world } from '../core/world';
import { gameState } from '../core/gameState';
import { destroyAsteroid } from '../shared/destroyAsteroid';
import { releaseBullet } from '../pools/bulletPool';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < bullet.radius + asteroid.radius) {

        world.remove(bullet);
        releaseBullet(bullet);
        destroyAsteroid(asteroid, 100);

        break;
      }
    }
  }

  for (const beam of beams) {

    const fx = Math.cos(beam.rotation);
    const fy = Math.sin(beam.rotation);

    for (const asteroid of asteroids) {

      const dx = asteroid.x - beam.x;
      const dy = asteroid.y - beam.y;

      const along = dx * fx + dy * fy;
      const side = Math.abs(dx * -fy + dy * fx);

      if (along > 0 && along < beam.length && side < asteroid.radius + beam.width) {
        destroyAsteroid(asteroid, beam.damage);
      }
    }
  }

for (const missile of missiles) {

  for (const asteroid of asteroids) {

    const dx = missile.x - asteroid.x;
    const dy = missile.y - asteroid.y;
    const dist = Math.hypot(dx, dy);

    if (dist < missile.radius + asteroid.radius) {
      destroyAsteroid(asteroid, missile.damage);
      world.remove(missile);

      break;
    }
  }
}

}