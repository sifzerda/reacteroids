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

    if (keys.Digit1) ship.weapon = 'raygun';
    else if (keys.Digit2) ship.weapon = 'shotgun';
    else if (keys.Digit3) ship.weapon = 'machinegun';
    else if (keys.Digit4) ship.weapon = 'plasma';
    else if (keys.Digit5) ship.weapon = 'flamethrower';
    else if (keys.Digit6) ship.weapon = 'chargegun';
    else if (keys.Digit7) ship.weapon = 'missilegun';
    else if (keys.Digit8) ship.weapon = 'lasergun';

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

        weapon.release(ship, ship.chargeTime);

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