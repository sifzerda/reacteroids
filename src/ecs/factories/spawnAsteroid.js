// src/ecs/factories/spawnAsteroid.js

import { world } from '../world';

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export function spawnAsteroid() {

  const limit = 9;
  const edge = Math.floor(Math.random() * 4);

  let x = 0;
  let y = 0;

  if (edge === 0) {
    x = rand(-limit, limit);
    y = limit;
  }

  if (edge === 1) {
    x = rand(-limit, limit);
    y = -limit;
  }

  if (edge === 2) {
    x = -limit;
    y = rand(-limit, limit);
  }

  if (edge === 3) {
    x = limit;
    y = rand(-limit, limit);
  }

  world.add({
    asteroid: true,

    x,
    y,

    vx: rand(-2, 2),
    vy: rand(-2, 2),

    rotation: 0,
    rotationSpeed: rand(-1, 1),
    radius: 0.8,
    health: 100,
  });
}