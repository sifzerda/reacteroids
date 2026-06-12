// src/ecs/systems/weaponSystem.js

import { ships } from '../core/queries';
import { keys } from '../core/input';
import { weapons } from '../content/weapons';

export function weaponSystem(
  delta
) {

  for (const ship of ships) {

    //
    // weapon switching
    //

    for (
      const [name, weapon]
      of Object.entries(weapons)
    ) {

      if (
        weapon.hotkey &&
        keys[weapon.hotkey]
      ) {
        ship.weapon = name;
      }
    }

    ship.cooldown -= delta;

    const weapon =
      weapons[ship.weapon];

    if (!weapon) continue;

    if (
      keys.Space &&
      ship.cooldown <= 0
    ) {

      ship.cooldown =
        weapon.cooldown;

      weapon.fire(ship);
    }
  }
}