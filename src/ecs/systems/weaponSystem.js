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

    const firing = keys.Space || (settings.controlScheme === 'keyboardMouse' && mouse.down);

    /*
    -------------------------------------------------
    CHARGE GUN
    -------------------------------------------------
    */

    if (ship.weapon === 'chargegun') {

      ship.chargeTime ??= 0;
      ship.charging ??= false;

      if (firing) {
        ship.chargeTime += delta;
        ship.charging = true;
      }

      else if (ship.charging) {
        weapon.release(ship, ship.chargeTime);
        ship.chargeTime = 0;
        ship.charging = false;
      }
      continue;
    }

    /*
    -------------------------------------------------
    LASER GUN
    -------------------------------------------------
    */

    if (ship.weapon === 'laserGun') {
      if (firing) {
        weapon.fire(ship);
      }
      continue;
    }

    /*
    -------------------------------------------------
    NORMAL WEAPONS
    -------------------------------------------------
    */

    if (firing && ship.cooldown <= 0 && weapon.fire) {
      ship.cooldown = weapon.cooldown;
      weapon.fire(ship);
    }
  }
}