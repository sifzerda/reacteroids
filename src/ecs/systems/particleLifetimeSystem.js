// src/ecs/systems/particleLifetimeSystem.js

import { particles } from '../core/queries';
import { world } from '../core/world';
import { releaseExhaust } from '../pools/exhaustPool';
import { releaseFlash } from '../pools/flashPool';
import { releaseSpark } from '../pools/sparkPool';

export function particleLifetimeSystem(delta) {

  for (const particle of particles) {

    particle.x += (particle.vx ?? 0) * delta;
    particle.y += (particle.vy ?? 0) * delta;

    particle.life -= delta;

if (particle.life > 0)
  continue;

world.remove(particle);

if (particle.particleExhaust) {
  releaseExhaust(particle);
}
else if (particle.particleFlash) {
  releaseFlash(particle);
}
else if (particle.particleSpark) {
  releaseSpark(particle);
}

  }
}