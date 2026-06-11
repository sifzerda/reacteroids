// src/ecs/features/weaponSystem.js

import { world } from '../../src/ecs/core/world';
import { ships } from "../../src/ecs/core/queries";
import { keys } from '../../src/ecs/core/input';
import { featureMap } from '.';

export function weaponSystem(delta) {

  for (const ship of ships) {

    // select weapon
    for (const feature of Object.values(featureMap)) {

      if (feature.hotkey && keys[feature.hotkey]) {
        if (ship.weapon === 'laser' && ship.laserEntity) {
          world.remove(ship.laserEntity);
          ship.laserEntity = null;
        }
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