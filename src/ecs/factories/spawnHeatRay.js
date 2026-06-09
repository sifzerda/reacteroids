// src/ecs/factories/spawnHeatRay.js

import { world } from '../world';

export function spawnHeatRay(ship) {

  return world.add({

    heatray: true,

    ship,

    damage: 200,

    length: 50,

    colorR: 4,
    colorG: 0,
    colorB: 0,
  });
}