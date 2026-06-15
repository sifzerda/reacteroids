// src/ecs/systems/weaponSystem.js

import { ships } from '../core/queries';
import { keys, mouse } from '../core/input';
import { settings } from '../core/settings';
import { weapons } from '../content/weapons';

export function weaponSystem(delta) {

  for (const ship of ships) {

    // weapon switching
    for (const [name, weapon] of Object.entries(weapons)) {

      if (weapon.hotkey && keys[weapon.hotkey]) {
        ship.weapon = name;
      }
    }

    ship.cooldown -= delta;
    const weapon = weapons[ship.weapon];

    if (!weapon) continue;

const firing =
  keys.Space ||
  (
    settings.controlScheme === 'keyboardMouse' &&
    mouse.down
  );

if (firing && ship.cooldown <= 0) {
  ship.cooldown = weapon.cooldown;
  weapon.fire(ship);
}
  }
}