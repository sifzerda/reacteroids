// src/ecs/factories/enemyFactory.js

import { world } from '../core/world';
import { enemyDefs } from '../defs/enemyDefs';

export function enemyFactory(type, props = {}) {

  const def = enemyDefs[type];

  if (!def) {
    throw new Error(`Unknown enemy ${type}`);
  }

  return world.add({
    enemy: true,
    enemyType: type,

    // core stats
    hp: def.hp,
    maxHp: def.hp,
    speed: def.speed,
    score: def.score,
    color: def.color,

    abilities: [...def.abilities],

    // spatial data (was transform + velocity + collider)
    x: props.x ?? 0,
    y: props.y ?? 0,
    rotation: 0,

    vx: 0,
    vy: 0,

    radius: def.radius,
    wrap: true,
  });
}