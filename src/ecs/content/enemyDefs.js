// ecs/content/enemyDefs.js

import { ships } from '../core/queries';
import { spawnBullet } from '../spawn';

export const enemyDefs = {

  drone: {

    hp: 100,
    radius: 0.5,
    speed: 3,

    render: {
      geometry: 'triangle',
      color: '#ff4444',
      scale: 1
    },

    update(enemy) {
      const ship = ships.first;
      if (!ship) return;
      const dx = ship.x - enemy.x;
      const dy = ship.y - enemy.y;
      const len = Math.hypot(dx, dy);
      if (len === 0) return;
      enemy.vx = dx / len * enemy.speed;
      enemy.vy = dy / len * enemy.speed;
    },

  },

   fighter: {

    hp: 120,
    radius: 0.6,
    speed: 4,
    render: { geometry: 'triangle', color: '#ff00ff', scale: 1.2},

    update(enemy, delta) {

      const ship = ships.first;

      if (!ship) return;

      // chase
      const dx = ship.x - enemy.x;
      const dy = ship.y - enemy.y;

      const len = Math.hypot(dx, dy);

      if (len > 0) {
        enemy.vx = dx / len * enemy.speed;
        enemy.vy = dy / len * enemy.speed;
      }

      // shoot
      enemy.fireCooldown ??= 0;
      enemy.fireCooldown -= delta;

      if (enemy.fireCooldown <= 0) {
        enemy.fireCooldown = 1;

        const rotation = Math.atan2(ship.y - enemy.y, ship.x - enemy.x);

        spawnBullet({x: enemy.x, y: enemy.y, rotation, speed: 8, colorR: 1, colorG: 0, colorB: 0});
      }
    }
  },

  kamikaze: {

    hp: 50,
    radius: 0.4,
    speed: 7,
    
    render: {
      geometry: 'diamond',
      color: '#ffaa00',
      scale: 1.5
    },

 update(enemy, delta) {

      enemy.dashTimer ??= 0;
      enemy.dashTimer -= delta;

      if (enemy.dashTimer > 0) return;

      enemy.dashTimer = 2;

      const ship = ships.first;

      if (!ship) return;

      const dx = ship.x - enemy.x;
      const dy = ship.y - enemy.y;

      const len = Math.hypot(dx, dy);

      if (len === 0) return;

      enemy.vx = dx / len * enemy.speed * 5;
      enemy.vy = dy / len * enemy.speed * 5;
    }
  },

  // adding a new enemy copy paste:

  //sniper: {
  //  hp:80,
  //  radius:0.4,
  //  speed:1.5,
  // update(enemy, ship){
  //    const dx = ship.x - enemy.x;
  //    const dy = ship.y - enemy.y;
  //    const dist = Math.hypot(dx,dy);
  //    if(dist > 6){
  //     enemy.vx = dx/dist * enemy.speed;
  //      enemy.vy = dy/dist * enemy.speed;
  //    }
  //  }
  //},

};