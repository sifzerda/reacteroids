// src/ecs/factories/spawnShip.js

import { world } from '../world';

import { transform } from '../components/transform';
import { velocity } from '../components/velocity';
import { collider } from '../components/collider';

export function spawnShip() {

  return world.add({

    ship: true,

    ...transform(
      0,
      0,
      0
    ),

    ...velocity(),

    ...collider(0.45),

    cooldown: 0,

    weapon: 'normal',
  });
}