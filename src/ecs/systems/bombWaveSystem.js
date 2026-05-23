// src/ecs/systems/bombWaveSystem.js

import {
  bombWaves,
  asteroids,
} from '../queries';

import { world }
  from '../world';

import { gameState }
  from '../gameState';

import { destroyAsteroid }
  from '../destroyAsteroid.js';

export function bombWaveSystem(delta) {

  for (const wave of bombWaves) {

    wave.radius +=
      wave.speed * delta;

    wave.life -= delta;

    // asteroid destruction

    for (const asteroid of asteroids) {

      const dx =
        asteroid.x - wave.x;

      const dy =
        asteroid.y - wave.y;

      const dist =
        Math.sqrt(dx * dx + dy * dy);

      if (
        dist <
        wave.radius + asteroid.radius
      ) {

        destroyAsteroid(asteroid, 200);
      }
    }

    if (
      wave.radius >= wave.maxRadius ||
      wave.life <= 0
    ) {
      world.remove(wave);
    }
  }
}