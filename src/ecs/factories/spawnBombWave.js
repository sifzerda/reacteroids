// src/ecs/factories/spawnBombWave.js

import { world } from '../world';

export function spawnBombWave({
  x,
  y,
}) {

  return world.add({

    bombWave: true,

    x,
    y,

    radius: 0.5,

    maxRadius: 12,

    speed: 20,

    life: 0.6,
  });
}