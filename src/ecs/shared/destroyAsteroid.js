// src/ecs/shared/destroyAsteroid.js
// this is the shared/collective function that destroys an asteroid

import { world } from '../core/world.js'
import { gameState } from '../core/gameState.js';
import { spawnAsteroid } from './factories/spawnAsteroid.js';

export function destroyAsteroid(asteroid, scoreValue = 100) {

  world.remove(asteroid);

  // SCORE
  gameState.score += scoreValue;

  // PROGRESS VALUE
  let progressValue = 0;

  if (asteroid.size === 3) {
    progressValue = 1;
  }
  else if (asteroid.size === 2) {
    progressValue = 0.5;
  }
  else if (asteroid.size === 1) {
    progressValue = 0.25;
  }

  gameState.waveProgress += progressValue;

  // SPLIT ASTEROIDS

  if (asteroid.size > 1) {

    for (let i = 0; i < 2; i++) {

      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      spawnAsteroid({

        x: asteroid.x,
        y: asteroid.y,

        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,

        radius: asteroid.radius * 0.6,
        size: asteroid.size - 1,
      });
    }
  }
}