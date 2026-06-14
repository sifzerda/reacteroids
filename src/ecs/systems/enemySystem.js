// src/ecs/systems/enemySystem.js

import { enemies } from '../core/queries';
import { enemyDefs } from '../content/enemyDefs';

export function enemySystem(delta) {

  for (const enemy of enemies) {

    const def = enemyDefs[enemy.enemyType];

    if (!def) continue;

    if (def.update) {

      def.update(enemy, delta);
    }
  }
}