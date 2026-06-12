// src/ecs/systems/enemySystem.js

import { enemyDefs } from '../content/enemyDefs';
import { world } from '../core/world';

export function enemySystem(delta) {

  for (const enemy of world.with('enemy')) {
    const def = enemyDefs[enemy.enemyType];
    if (!def) continue;
    def.update(enemy, delta);
  }
}