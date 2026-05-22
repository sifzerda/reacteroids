// makes the game world wrap around
// src/ecs/systems/wrapSystem.js

import { wrappable } from '../queries';

export function wrapSystem(viewport) {

  const limitX = viewport.width / 2;
  const limitY = viewport.height / 2;

  for (const entity of wrappable) {

    const padding = entity.radius || 0;

    if (entity.x > limitX + padding)
      entity.x = -limitX - padding;

    if (entity.x < -limitX - padding)
      entity.x = limitX + padding;

    if (entity.y > limitY + padding)
      entity.y = -limitY - padding;

    if (entity.y < -limitY - padding)
      entity.y = limitY + padding;
  }
}