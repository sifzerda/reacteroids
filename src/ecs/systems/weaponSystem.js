// src/ecs/systems/weaponSystem.js

import { ships } from '../queries';
import { keys } from '../input';
import { weapons } from '../weapons';

export function weaponSystem(delta) {

for (const ship of ships) {

    if (keys['Digit1']) {
      ship.weapon = 'raygun';
    }

    if (keys['Digit2']) {
      ship.weapon = 'shotgun';
    }

    if (keys['Digit3']) {
      ship.weapon = 'machinegun';
    }

if (keys['Digit5']) {
  ship.weapon = 'heatray';
}

if (keys['Digit6']) {
  ship.weapon = 'flamethrower';
}


    ship.cooldown -= delta;

    const weapon = weapons[ship.weapon];

    if (!weapon) continue;

    if (
      keys['Space'] && ship.cooldown <= 0
    ) {

      ship.cooldown = weapon.cooldown;

      weapon.fire(ship);
    }
  }
}
 