// src/ecs/systems/shipCollisionSystem.js

import { ships, asteroids } from '../core/queries';

export function shipCollisionSystem( delta, onGameOver ) {

  for (const ship of ships) {

    if (ship.invulnerable > 0) {
      ship.invulnerable -= delta;
    }

    for (const asteroid of asteroids) {

      const dx = ship.x - asteroid.x;
      const dy = ship.y - asteroid.y;
      const r = ship.radius + asteroid.radius;
      const collision = dx * dx + dy * dy < r * r;

      if ( !collision || ship.invulnerable > 0 ) {
        continue;
      }

      ship.lives--;
      ship.invulnerable = 2;

      ship.x = 0;
      ship.y = 0;

      ship.vx = 0;
      ship.vy = 0;

      for (const asteroid of asteroids) {

        const dx = asteroid.x - ship.x;
        const dy = asteroid.y - ship.y;

        if ( dx * dx + dy * dy < 36 ) {

          const angle = Math.random() * Math.PI * 2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          asteroid.x = cos * 10;
          asteroid.y = sin * 10;
        }
      }

      if (ship.lives <= 0) {
        onGameOver?.();
      }

      break;
    }
  }
}