// src/ecs/systems/ParticleSystem.js

import { ships } from '../core/queries';
import { keys } from '../core/input';
import { spawnParticle } from '../spawn';

export function particleSystem() {

  for (const ship of ships) {

    if (!keys['ArrowUp'])
      continue;

    const angle = ship.rotation;
    const rearDistance = 0.40;

    const x = ship.x - Math.cos(angle) * rearDistance;
    const y = ship.y - Math.sin(angle) * rearDistance;

    spawnParticle({

      particleType: 'exhaust',

      x,
      y,

      vx: -Math.cos(angle) * 3 + (Math.random() - 0.5),
      vy: -Math.sin(angle) * 3 + (Math.random() - 0.5),

      life: 1.1,
      size: 10,
    });
  }
}