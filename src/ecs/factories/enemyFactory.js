// src/ecs/factories/enemyFactory.js

import { world } from '../core/world';

import { enemyDefs } from '../defs/enemyDefs';

import { transform } from '../components/transform';
import { velocity } from '../components/velocity';
import { collider } from '../components/collider';

export function enemyFactory(type, props = {}) {

  const def = enemyDefs[type];

  if (!def) {
    throw new Error(`Unknown enemy ${type}`);
  }

  return world.add({

    enemy: true,

    enemyType: type,

    hp: def.hp,
    maxHp: def.hp,

    speed: def.speed,

    score: def.score,

    color: def.color,

    abilities: [...def.abilities],

    wrap: true,

    ...transform(
      props.x ?? 0,
      props.y ?? 0
    ),

    ...velocity(),

    ...collider(def.radius),
  });
}