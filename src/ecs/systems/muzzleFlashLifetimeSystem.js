// src/ecs/systems/muzzleFlashLifetimeSystem.js

import { muzzleFlashes } from '../core/queries';
import { world } from '../core/world';

export function muzzleFlashLifetimeSystem(delta) {

  for (const p of muzzleFlashes) {

    p.life -= delta;

    if (p.life <= 0) {
      world.remove(p);
    }

  }

}