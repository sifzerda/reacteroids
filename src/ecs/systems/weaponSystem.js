// src/ecs/systems/weaponSystem.js

import { ships } from '../queries';
import { keys } from '../input';

import { weapons } from '../weapons';

export function weaponSystem(delta) {

for (const ship of ships) {

    if (keys['Digit1']) {
      ship.weapon = 'normal';
    }

    if (keys['Digit2']) {
      ship.weapon = 'shotgun';
    }

    if (keys['Digit3']) {
      ship.weapon = 'machinegun';
    }

    ship.cooldown -= delta;

    const weapon = weapons[ship.weapon];

    if (!weapon) continue;

    if (
      keys['Space'] &&
      ship.cooldown <= 0
    ) {

      ship.cooldown = weapon.cooldown;

      weapon.fire(ship);
    }
  }
}
 