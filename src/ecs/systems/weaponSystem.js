// src/ecs/systems/weaponSystem.js

import { ships } from '../core/queries';
import { keys, mouse } from '../core/input';
import { settings } from '../core/settings';
import { world } from '../core/world';
import { weapons } from '../content/weapons';

const MUZZLE_OFFSET = 1.1;

export function weaponSystem(delta) {

  for (const ship of ships) {

    /*
    -------------------------------------------------
    WEAPON SWITCHING
    -------------------------------------------------
    */

    let previousWeapon = ship.weapon;

    if (keys.Digit1) {
      ship.weapon = 'raygun';
      ship.currentWeapon = weapons.raygun;
    }
    else if (keys.Digit2) {
      ship.weapon = 'shotgun';
      ship.currentWeapon = weapons.shotgun;
    }
    else if (keys.Digit3) {
      ship.weapon = 'machinegun';
      ship.currentWeapon = weapons.machinegun;
    }
    else if (keys.Digit4) {
      ship.weapon = 'plasmatorch';
      ship.currentWeapon = weapons.plasmatorch;
    }
    else if (keys.Digit5) {
      ship.weapon = 'flamethrower';
      ship.currentWeapon = weapons.flamethrower;
    }
    else if (keys.Digit6) {
      ship.weapon = 'missilelauncher';
      ship.currentWeapon = weapons.missilelauncher;
    }
    else if (keys.Digit7) {
      ship.weapon = 'laserbeam';
      ship.currentWeapon = weapons.laserbeam;
    }

    ship.cooldown -= delta;

    if (!ship.currentWeapon) {
      ship.currentWeapon = weapons[ship.weapon];
    }

    const weapon = ship.currentWeapon;
    if (!weapon) continue;

    const muzzleX = ship.x + ship.forwardX * MUZZLE_OFFSET;
    const muzzleY = ship.y + ship.forwardY * MUZZLE_OFFSET;

    const firing = keys.Space || (settings.controlScheme === 'keyboardMouse' && mouse.down);

    /*
    -------------------------------------------------
    LASER GUN
    -------------------------------------------------
    */

    if (ship.weapon === 'laserbeam') {
      if (firing) {
        weapon.fire(ship, muzzleX, muzzleY);
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
      weapon.fire(ship, muzzleX, muzzleY);
    }
  }
}