// src/ecs/abilities/enemyAbilities.js

import { ships } from '../core/queries';

import { spawnBullet } from '../shared/factories/spawnBullet';

export const enemyAbilities = {

  chase(enemy) {

    const ship = ships.first;

    if (!ship) return;

    const dx = ship.x - enemy.x;
    const dy = ship.y - enemy.y;

    const len = Math.hypot(dx, dy);

    if (len === 0) return;

    enemy.vx = dx / len * enemy.speed;
    enemy.vy = dy / len * enemy.speed;
  },

  dash(enemy, delta) {

    enemy.dashTimer ??= 0;

    enemy.dashTimer -= delta;

    if (enemy.dashTimer > 0) return;

    enemy.dashTimer = 2;

    const ship = ships.first;

    if (!ship) return;

    const dx = ship.x - enemy.x;
    const dy = ship.y - enemy.y;

    const len = Math.hypot(dx, dy);

    enemy.vx = dx / len * enemy.speed * 5;
    enemy.vy = dy / len * enemy.speed * 5;
  },

  shoot(enemy, delta) {

    enemy.fireCooldown ??= 0;

    enemy.fireCooldown -= delta;

    if (enemy.fireCooldown > 0) return;

    enemy.fireCooldown = 1;

    const ship = ships.first;

    if (!ship) return;

    const rotation = Math.atan2(ship.y - enemy.y, ship.x - enemy.x);

    spawnBullet({

      x: enemy.x,
      y: enemy.y,

      rotation,

      speed: 8,

      colorR: 1,
      colorG: 0,
      colorB: 0
    });
  }
};