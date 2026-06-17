// src/ecs/systems/missileSystem.js

import { missiles } from '../core/queries';
import { findNearestAsteroid } from '../shared/findNearestAsteroid';
import { world } from '../core/world';
import { releaseMissile } from '../pools/missilePool';

export function missileSystem(delta) {

  for (const missile of missiles) {

    missile.life -= delta;

    if (missile.life <= 0) {

      world.remove(missile);
      releaseMissile(missile);

      continue;
    }

    if (!missile.target || !missile.target.asteroid || missile.target.dead) {
      missile.target = findNearestAsteroid(missile.x, missile.y);
    }

    if (!missile.target) continue;

    const dx = missile.target.x - missile.x;
    const dy = missile.target.y - missile.y;
    const desired = Math.atan2(dy, dx);

    let diff = desired - missile.rotation;

    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;

    const turn = missile.turnRate * delta;

    diff = Math.max(-turn, Math.min(turn, diff));

    missile.rotation += diff;
    missile.vx = Math.cos(missile.rotation) * missile.speed;
    missile.vy = Math.sin(missile.rotation) * missile.speed;
  }
}