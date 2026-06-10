// src/ecs/shared/factories/spawnExhaustParticle.js

import { world } from '../../core/world';

export function spawnExhaustParticle({
  x,
  y,
  vx,
  vy,
}) {

  world.add({

    exhaust: true,

    x,
    y,

    vx,
    vy,

    life: 1.1,

    radius: 0.12,

    // hot blue core
    colorR: 0.2,
    colorG: 0.7,
    colorB: 2.0,
  });
}