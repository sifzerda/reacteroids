// src/ecs/systems/asteroidSystem.js

import { asteroids } from '../core/queries';

export function asteroidSystem(delta) {
  for (const asteroid of asteroids) {

    // optional rotation
    if (asteroid.rotationSpeed) {
      asteroid.rotation += asteroid.rotationSpeed * delta;
    }

    // optional drift wobble (nice feel)
    if (asteroid.wobble) {
      asteroid.x += Math.sin(asteroid.y * 0.5) * 0.001;
    }
  }
}