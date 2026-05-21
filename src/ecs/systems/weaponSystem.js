// src/ecs/systems/weaponSystem.js

import { ships } from '../queries';
import { keys } from '../input';

import { weapons } from '../weapons';

export function weaponSystem(delta) {

  for (const ship of ships) {

    ship.cooldown -= delta;

    const weapon =
      weapons[ship.weapon];

    if (!weapon) continue;

    if (
      keys['Space'] &&
      ship.cooldown <= 0
    ) {

      ship.cooldown =
        weapon.cooldown;

      weapon.fire(ship);
    }
  }
}
 