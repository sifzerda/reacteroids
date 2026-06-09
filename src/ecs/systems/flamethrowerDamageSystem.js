// src/ecs/systems/flamethrowerDamageSystem.js

import {flamethrowers, asteroids} from '../queries';

export function flamethrowerDamageSystem(delta) {

  for (const flame of flamethrowers) {

    const ship = flame.ship;

    const dirX =
      Math.cos(ship.rotation);

    const dirY =
      Math.sin(ship.rotation);

    for (const asteroid of asteroids) {

      const dx =
        asteroid.x - ship.x;

      const dy =
        asteroid.y - ship.y;

      const along =
        dx * dirX +
        dy * dirY;

      if (along < 0)
        continue;

      if (along > flame.length)
        continue;

      const perp =
        Math.abs(
          dx * (-dirY) +
          dy * dirX
        );

      const width =
        0.5 +
        along * 0.15;

      if (perp < width) {

        asteroid.health -=
          flame.damage * delta;
      }
    }
  }
}