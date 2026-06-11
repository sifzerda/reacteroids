// src/ecs/systems/enemySystem.js

import { enemies } from '../core/queries';
import { enemyAbilities } from '../abilities/enemyAbilities';

export function enemySystem(delta) {

  for (const enemy of enemies) {

    for (const abilityName of enemy.abilities) {
        
      const ability = enemyAbilities[abilityName];

      if (ability) {
        ability(enemy, delta);
      }
    }
  }
}