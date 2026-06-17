// src/ecs/systems/bulletLifetimeSystem.js

import { bullets } from '../core/queries';
import { world } from '../core/world';
import { releaseBullet } from '../pools/bulletPool';

export function bulletLifetimeSystem(delta) {

  for (const bullet of bullets) {

    bullet.life -= delta;

    if (bullet.life <= 0) {
      world.remove(bullet);
      releaseBullet(bullet);
    }
  }
}