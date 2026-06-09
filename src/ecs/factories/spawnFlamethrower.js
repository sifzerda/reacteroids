// src/ecs/factories/spawnFlamethrower.js

import { world } from '../world';

export function spawnFlamethrower(ship) {

  return world.add({

    flamethrower: true,

    ship,

    damage: 120,

    length: 6,

    spread: 1.2,

    colorR: 2,
    colorG: 0.5,
    colorB: 0,
  });
}