// src/ecs/features/lasergun/laserDamageSystem.js

import { lasers } from '../../core/queries';
import { asteroids } from '../../core/queries';
import { destroyAsteroid } from '../../shared/destroyAsteroid';

export function laserDamageSystem(delta) {

  for (const laser of lasers) {

    const sx = laser.x;
    const sy = laser.y;

    const ex =
      sx +
      Math.cos(laser.rotation)
      * laser.length;

    const ey =
      sy +
      Math.sin(laser.rotation)
      * laser.length;

    for (const asteroid of asteroids) {

      const dx = ex - sx;
      const dy = ey - sy;

      const lenSq =
        dx * dx + dy * dy;

      const t =
        Math.max(
          0,
          Math.min(
            1,
            (
              (
                asteroid.x - sx
              ) * dx +
              (
                asteroid.y - sy
              ) * dy
            ) / lenSq
          )
        );

      const px =
        sx + dx * t;

      const py =
        sy + dy * t;

      const dist =
        Math.hypot(
          asteroid.x - px,
          asteroid.y - py
        );

      if (
        dist <
        asteroid.radius
      ) {

        destroyAsteroid(
          asteroid,
          laser.damage * delta
        );
      }
    }
  }
}