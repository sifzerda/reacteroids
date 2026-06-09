// src/ecs/systems/heatraySystem.js

import { ships } from '../queries';
import { heatrays } from '../queries';
import { keys } from '../input';
import { world } from '../world';
import { spawnHeatRay } from '../factories/spawnHeatRay';

export function heatraySystem() {

  for (const ship of ships) {

    if (ship.weapon !== 'heatray')
      continue;

    let beam = null;

    for (const r of heatrays) {

      if (r.ship === ship) {

        beam = r;
        break;
      }
    }

    if (keys['Space']) {

      if (!beam) {

        beam = spawnHeatRay(ship);
      }
    }
    else {

      if (beam) {

        world.remove(beam);
      }
    }
  }
}