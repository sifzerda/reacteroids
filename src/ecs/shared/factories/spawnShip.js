// src/ecs/shared/factories/spawnShip.js

import { world } from '../../core/world';

import { transform } from '../../components/transform';
import { velocity } from '../../components/velocity'
import { collider } from '../../components/collider';
import { weapon } from '../../components/weapon';

export function spawnShip() {

  return world.add({

    ship: true,
    wrap: true,
    lives: 3,
    invulnerable: 0,

    weapon: 'raygun',
    cooldown: 0,

    ...transform(0, 0, 0),
    ...velocity(),
    ...collider(0.45),
  });
}