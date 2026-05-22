// src/ecs/systems/asteroidSystem.js

import { asteroids } from '../queries';

export function asteroidSystem(delta) {

  for (const asteroid of asteroids) {

    asteroid.rotation += asteroid.rotationSpeed * delta;

    // screen wrap

    const limit = 10;

    if (asteroid.x > limit) asteroid.x = -limit;
    if (asteroid.x < -limit) asteroid.x = limit;
    if (asteroid.y > limit) asteroid.y = -limit;
    if (asteroid.y < -limit) asteroid.y = limit;
  }
}