// src/ecs/systems/exhaustLifetimeSystem.js

import { exhaustParticles } from '../core/queries';
import { world } from '../core/world';

export function exhaustLifetimeSystem(delta) {

  for (const exhaust of exhaustParticles) {

    exhaust.life -= delta;

    if (exhaust.life <= 0) {
      world.remove(exhaust);
    }
  }
}