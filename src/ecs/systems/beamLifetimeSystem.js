// src/ecs/systems/beamLifetimeSystem.js

import { beams } from '../core/queries';
import { world } from '../core/world';
import { releaseBeam } from '../pools/beamPool';

export function beamLifetimeSystem(delta) {

  for (const beam of beams) {

    beam.life -= delta;

    if (beam.life <= 0) {

      world.remove(beam);
      releaseBeam(beam);
    }
  }
}