// src/ecs/systems/smokeLifetimeSystem.js

import { smokeParticles } from '../core/queries';
import { world } from '../core/world';

export function smokeLifetimeSystem(delta) {

  for (const p of smokeParticles) {

    p.life -= delta;

    if (p.life <= 0) {
      world.remove(p);
    }

  }

}