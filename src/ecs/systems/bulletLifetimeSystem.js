// src/ecs/systems/bulletLifetimeSystem.js

import { bullets } from '../queries';
import { world } from '../world';

export function bulletLifetimeSystem(delta) {

  for (const bullet of bullets) {

    bullet.life -= delta;

    if (bullet.life <= 0) {
      world.remove(bullet);
    }
  }
}