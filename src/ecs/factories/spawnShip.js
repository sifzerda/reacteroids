// src/ecs/factories/spawnShip.js

import { world } from '../world';

export function spawnShip() {
  return world.add({
    ship: true,

    x: 0,
    y: 0,

    vx: 0,
    vy: 0,

    rotation: 0,

    radius: 0.45,

    cooldown: 0,

    weapon: 'normal',
  });
}