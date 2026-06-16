// src/ecs/shred/findNearestAsteroid.js

import { asteroids } from '../core/queries';

export function findNearestAsteroid(x, y) {

  let best = null;
  let bestDist = Infinity;

  for (const asteroid of asteroids) {

    const dx = asteroid.x - x;
    const dy = asteroid.y - y;

    const d2 = dx * dx + dy * dy;

    if (d2 < bestDist) {

      bestDist = d2;
      best = asteroid;
    }
  }

  return best;
}