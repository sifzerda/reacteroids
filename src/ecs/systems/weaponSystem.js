// src/ecs/systems/weaponSystem.js

import { ships } from '../core/queries';
import { keys } from '../core/input';
import { weaponDefs } from '../defs/weaponDefs';
import { weaponAbilities } from '../abilities/weaponAbilities';

export function weaponSystem(delta) {
 console.log('Space:', keys.Space);
  for (const ship of ships) {
  console.log(
    'weapon:', ship.weapon,
    'cooldown:', ship.cooldown,
    'space:', keys.Space
  );
    //
    // weapon switching
    //

    for (
      const [weaponName, def]
      of Object.entries(weaponDefs)
    ) {

      if (
        def.hotkey &&
        keys[def.hotkey]
      ) {
        ship.weapon = weaponName;
      }
    }

    //
    // cooldown
    //

    ship.cooldown -= delta;

    const weapon =
      weaponDefs[ship.weapon];

    if (!weapon) continue;

    if (
      keys.Space &&
      ship.cooldown <= 0
    ) {
      console.log('FIRE');

      ship.cooldown =
        weapon.cooldown;

      for (
        const abilityName
        of weapon.abilities
      ) {

        const ability =
          weaponAbilities[
            abilityName
          ];

        ability?.(ship);
      }
    }
  }
}