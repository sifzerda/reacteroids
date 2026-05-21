// ecs/resetGame.js

import { world } from './world';

export function resetGame() {

  for (const entity of world.entities) {
    world.remove(entity);
  }
}