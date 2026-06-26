// src/ecs/shared/destroyAsteroid.js
// this is the shared/collective function that destroys an asteroid

import { world } from '../core/world';
import { gameState } from '../core/gameState';
import { spawnAsteroid } from '../spawn';
import { releaseAsteroid } from '../pools/asteroidPool';

export function destroyAsteroid(asteroid, scoreValue = 100) {

  // SAVE DATA BEFORE RETURNING TO POOL

  const x = asteroid.x;
  const y = asteroid.y;
  const size = asteroid.size;
  const radius = asteroid.radius;

  // REMOVE FROM ECS
  world.remove(asteroid);

  // RETURN OBJECT TO POOL
  releaseAsteroid(asteroid);

  // SCORE
  gameState.score += scoreValue;

  // WAVE PROGRESS
  let progressValue = 0;

  if (size === 3) {
    progressValue = 1;
  }
  else if (size === 2) {
    progressValue = 0.5;
  }
  else if (size === 1) {
    progressValue = 0.25;
  }

  gameState.waveProgress += progressValue;

  // SPLIT ASTEROIDS
  if (size > 1) {

    for (let i = 0; i < 2; i++) {

      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;

      spawnAsteroid({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: radius * 0.6,
        size: size - 1,
      });
    }
  }
}