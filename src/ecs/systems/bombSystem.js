// src/ecs/systems/bombSystem.js

import { ships, asteroids } from '../queries';
import { world } from '../world';
import { gameState } from '../gameState';
import { keys } from '../input';
import { spawnBombWave } from '../factories/spawnBombWave';
import { gameEffects } from '../fx/gameEffects';

let bombPressed = false;

export function bombSystem() {

  const ship = ships.first;

  if (!ship) return;

  // prevent holding key down

  if (!keys['KeyB']) {

    bombPressed = false;
    return;
  }

  if (bombPressed) return;

  if (!gameState.bombReady) return;

  bombPressed = true;

  gameState.bombReady = false;
  gameState.bombCharge = 0;
  gameEffects.screenShake = 1.5;

  spawnBombWave({

    x: ship.x,
    y: ship.y,
    radius: 0,
  });
}