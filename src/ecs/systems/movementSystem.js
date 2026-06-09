// src/ecs/systems/movementSystem.js

import { movable } from '../core/queries';

export function movementSystem(delta) {

  for (const entity of movable) {

    entity.x += entity.vx * delta;
    entity.y += entity.vy * delta;
  }
}