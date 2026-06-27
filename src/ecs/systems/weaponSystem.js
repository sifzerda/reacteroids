// src/ecs/systems/weaponSystem.js

import { ships } from '../core/queries';
import { keys, mouse } from '../core/input';
import { settings } from '../core/settings';
import { world } from '../core/world';
import { weapons } from '../content/weapons';

const CHARGE_MAX_TIME = 3;
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
      ship.weapon = 'chargegun';
      ship.currentWeapon = weapons.chargegun;
    }
    else if (keys.Digit7) {
      ship.weapon = 'missilelauncher';
      ship.currentWeapon = weapons.missilelauncher;
    }
    else if (keys.Digit8) {
      ship.weapon = 'laserbeam';
      ship.currentWeapon = weapons.laserbeam;
    }

    /*
    -------------------------------------------------
    CLEANUP CHARGE EFFECT IF WEAPON CHANGED
    -------------------------------------------------
    */

    if (
      previousWeapon === 'chargegun' && ship.weapon !== 'chargegun'
    ) {
      ship.chargeTime = 0;
      ship.charging = false;

      if (ship.chargeEffect) {
        world.remove(ship.chargeEffect);
        ship.chargeEffect = null;
      }
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
    CHARGE GUN
    -------------------------------------------------
    */

    if (ship.weapon === 'chargegun') {

      ship.chargeTime ??= 0;
      ship.charging ??= false;

      const muzzleX = ship.x + ship.forwardX * MUZZLE_OFFSET;
      const muzzleY = ship.y + ship.forwardY * MUZZLE_OFFSET;

      if (firing) {

        ship.charging = true;
        ship.chargeTime += delta;

        const charge = Math.min(ship.chargeTime / CHARGE_MAX_TIME, 1);

        if (!ship.chargeEffect) {

          ship.chargeEffect = world.add({
            chargeEffect: true,
            x: muzzleX,
            y: muzzleY,
            rotation: ship.rotation,
            charge,
          });

        } else {

          ship.chargeEffect.x = muzzleX;
          ship.chargeEffect.y = muzzleY;
          ship.chargeEffect.rotation = ship.rotation;
          ship.chargeEffect.charge = charge;
        }
      }

      else if (ship.charging) {

        weapon.release(ship, ship.chargeTime, muzzleX, muzzleY);

        ship.chargeTime = 0;
        ship.charging = false;

        if (ship.chargeEffect) {
          world.remove(ship.chargeEffect);
          ship.chargeEffect = null;
        }
      }

      continue;
    }

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