// src/ecs/systems/weaponSystem.js

import { ships } from '../queries';
import { keys } from '../input';
//import { spawnBullet } from '../factories/spawnBullet';
import { weapons } from '../weapons';

export function weaponSystem(delta) {
  for (const ship of ships) {

    // SWITCH WEAPONS

    if (keys['Digit1']) {
      ship.weapon = 'raygun';
    }

    if (keys['Digit2']) {
      ship.weapon = 'shotgun';
    }

    if (keys['Digit3']) {
      ship.weapon = 'machinegun';
    }

    // CURRENT WEAPON

    const weapon =
      weapons[ship.weapon];

    if (!weapon) continue;

    // COOLDOWN

    ship.cooldown -= delta;

    // FIRE

    if (
      keys['Space'] &&
      ship.cooldown <= 0
    ) {
      ship.cooldown = weapon.cooldown;

      //const muzzleDistance = 0.7;

      weapon.fire(ship);
    }
    
    }
  }
 