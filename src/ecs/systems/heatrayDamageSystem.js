// src/ecs/systems/heatrayDamageSystem.js

import { heatrays, asteroids } from '../queries';

export function heatrayDamageSystem(delta) {

  for (const beam of heatrays) {

    const ship = beam.ship;

    const sx = ship.x;
    const sy = ship.y;

    const dirX = Math.cos(ship.rotation);

    const dirY = Math.sin(ship.rotation);

    for (const asteroid of asteroids) {

      const dx = asteroid.x - sx;
      const dy = asteroid.y - sy;

      const along = dx * dirX + dy * dirY;

      if (along < 0) continue;

      if (along > beam.length) continue;

      const perp = Math.abs(dx * (-dirY) + dy * dirX);

      if (perp < asteroid.radius) {

        asteroid.health -= beam.damage * delta;
      }
    }
  }
}