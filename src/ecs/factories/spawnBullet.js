// src/ecs/factories/spawnBullet.js

import { world } from '../world';

export function spawnBullet({
  x,
  y,
  rotation,

  speed = 20,

  damage = 100,

  radius = 0.15,

  colorR = 1,
  colorG = 0,
  colorB = 1,

  life = 1.2,
}) {
  world.add({
    bullet: true,

    x,
    y,

    vx: Math.cos(rotation) * speed,
    vy: Math.sin(rotation) * speed,

    rotation,

    damage,

    radius,

    colorR,
    colorG,
    colorB,

    life,
  });
}