// src/ecs/factories/spawnBullet.js

import { world } from '../world';

export function spawnBullet({
  x,
  y,
  rotation,
}) {
  const speed = 20;

  world.add({
    bullet: true,

    x,
    y,

    vx: Math.sin(rotation) * speed,

    vy: Math.cos(rotation) * speed,

    rotation,

    life: 1.2,
  });
}