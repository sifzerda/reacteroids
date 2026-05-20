// src/ecs/systems/movementSystem.js

import { movable } from '../queries';

export function movementSystem(delta) {
  for (const e of movable) {
    e.x += e.vx * delta;
    e.y += e.vy * delta;
  }
}