// makes the game world wrap around

import { wrappable } from '../queries';

const LIMIT = 9;

export function wrapSystem() {

  for (const entity of wrappable) {

    if (entity.x > LIMIT)
      entity.x = -LIMIT;

    if (entity.x < -LIMIT)
      entity.x = LIMIT;

    if (entity.y > LIMIT)
      entity.y = -LIMIT;

    if (entity.y < -LIMIT)
      entity.y = LIMIT;
  }
}