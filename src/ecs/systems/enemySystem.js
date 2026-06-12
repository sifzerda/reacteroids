// src/ecs/systems/enemySystem.js

import {
  enemies
}
from '../content/enemies';

import {
  ships
}
from '../core/queries';

import {
  world
}
from '../core/world';

export function enemySystem(
  delta
) {

  const ship =
    ships.first;

  if (!ship) return;

  for (
    const enemy
    of world.with('enemy')
  ) {

    const def =
      enemies[
        enemy.enemyType
      ];

    if (!def) continue;

    def.update(
      enemy,
      ship,
      delta
    );
  }
}