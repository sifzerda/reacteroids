// src/ecs/features/weaponSystem.js

import { ships } from "../core/queries";
import { keys } from '../core/input';
import { featureMap } from '../features';

export function weaponSystem(delta) {

  for (const ship of ships) {

    // select weapon
    for (const feature of Object.values(featureMap)) {

      if (feature.hotkey && keys[feature.hotkey]) {
        ship.weapon = feature.id;
      }
    }

    ship.cooldown -= delta;

    const feature = featureMap[ship.weapon];

    if (!feature) continue;

    if (keys['Space'] && ship.cooldown <= 0) {

      ship.cooldown = feature.cooldown ?? 0;

      feature.fire(ship);
    }
  }
}