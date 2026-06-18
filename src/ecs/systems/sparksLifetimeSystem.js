// src/ecs/systems/sparksLifetimeSystem.js

import { sparkParticles } from '../core/queries';
import { world } from '../core/world';

export function sparksLifetimeSystem(delta) {

  for (const p of sparkParticles) {

    p.life -= delta;

    if (p.life <= 0) {
      world.remove(p);
    }

  }

}