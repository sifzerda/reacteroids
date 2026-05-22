// src/ecs/systems/bombSystem.js

import { ships, asteroids }
  from '../queries';

import { world }
  from '../world';

import { gameState }
  from '../gameState';

import { keys }
  from '../input';

let bombPressed = false;

export function bombSystem() {

  const ship = ships.first;

  if (!ship) return;

  // prevent holding key down

  if (!keys['KeyB']) {

    bombPressed = false;
    return;
  }

  if (bombPressed)
    return;

  if (!gameState.bombReady)
    return;

  bombPressed = true;

  gameState.bombReady = false;
  gameState.bombCharge = 0;

  const radius = 6;

  for (const asteroid of asteroids) {

    const dx =
      asteroid.x - ship.x;

    const dy =
      asteroid.y - ship.y;

    const dist =
      Math.sqrt(dx * dx + dy * dy);

    if (dist <= radius) {

      world.remove(asteroid);

      gameState.score += 200;
    }
  }
}