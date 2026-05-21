// src/ecs/systems/shipSystem.js

import { world } from '../world';

import { transform } from '../components/transform';
import { velocity } from '../components/velocity';
import { collider } from '../components/collider';
import { weapon } from '../components/weapon';

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

    ...weapon('normal'),
  });
}