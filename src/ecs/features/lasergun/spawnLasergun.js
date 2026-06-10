// src/ecs/features/lasergun/spawnLasergun.js

import { world } from '../../core/world';

export function spawnLasergun({
  ship,

  length = 50,
  width = 0.08,

  colorR = 1,
  colorG = 0,
  colorB = 0,

  damage = 100,
}) {

  return world.add({

    laser: true,

    ship,

    x: ship.x,
    y: ship.y,

    rotation: ship.rotation,

    length,
    width,

    colorR,
    colorG,
    colorB,

    damage,
  });
}