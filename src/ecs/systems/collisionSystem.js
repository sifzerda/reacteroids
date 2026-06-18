// src/ecs/systems/collisionSystem.js

import { bullets, asteroids, beams, missiles } from '../core/queries';
import { world } from '../core/world';
import { gameState } from '../core/gameState';
import { destroyAsteroid } from '../shared/destroyAsteroid';
import { releaseBullet } from '../pools/bulletPool';

import { releaseBeam } from '../pools/beamPool';
import { releaseMissile } from '../pools/missilePool';
import { releaseParticle } from '../pools/particlePool';
import { spawnParticle } from '../spawn';

import {
  PARTICLE_SPARK,
} from '../shared/particleTypes';

export function collisionSystem() {

  for (const bullet of bullets) {

    for (const asteroid of asteroids) {

      const dx = bullet.x - asteroid.x;
      const dy = bullet.y - asteroid.y;

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < bullet.radius + asteroid.radius) {

        for (let i = 0; i < 24; i++) {

          const angle =
            Math.random() *
            Math.PI * 2;

          const speed =
            3 +
            Math.random() * 8;

          spawnParticle({
            particleType: PARTICLE_SPARK,

            x: bullet.x,
            y: bullet.y,

            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed

          });

        }

        world.remove(bullet);
        releaseBullet(bullet);

        destroyAsteroid(
          asteroid,
          100
        );

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
        destroyAsteroid(asteroid, beam.damage, 100);
        world.remove(beam);
        releaseBeam(beam);
      }
    }
  }

  for (const missile of missiles) {

    for (const asteroid of asteroids) {

      const dx = missile.x - asteroid.x;
      const dy = missile.y - asteroid.y;
      const dist = Math.hypot(dx, dy);

      if (dist < missile.radius + asteroid.radius) {
        destroyAsteroid(asteroid, missile.damage, 100);
        world.remove(missile);
        releaseMissile(missile);

        break;
      }
    }
  }

}