// src/ecs/systems/particleLifetimeSystem.js

import { particles }
  from '../core/queries';

import { world }
  from '../core/world';

import {
  releaseParticle
}
from '../pools/particlePool';

export function particleLifetimeSystem(
  delta
) {

  for (const particle of particles) {

    particle.x +=
      particle.vx * delta;

    particle.y +=
      particle.vy * delta;

    particle.life -=
      delta;

    if (particle.life <= 0) {

      world.remove(
        particle
      );

      releaseParticle(
        particle
      );
    }
  }
}