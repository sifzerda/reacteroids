// src/ecs/factories/spawnExhaustParticle.js

import { world } from '../world';

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

    life: 0.90,
    radius: 0.04,
    colorR: 1,
    colorG: 0.4,
    colorB: 0,

    });
}