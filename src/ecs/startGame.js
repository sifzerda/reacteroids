// ecs/startGame.js
// initializes start game state

import { spawnShip, spawnAsteroid } from './spawn.js';
import { gameState } from './core/gameState';
import { enemyFactory } from './factories/enemyFactory';

export function startGame() {

  spawnShip();

  // RESET GAME STATE
  gameState.score = 0;
  gameState.wave = 1;
  gameState.waveProgress = 0;

  const count = 8;

  // each asteroid tree = 3 progress
  gameState.waveProgressRequired = count * 3;

  for (let i = 0; i < count; i++) {

    spawnAsteroid({

      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 0.7 + Math.random() * 1.5,
      size: 3,
    });

    enemyFactory('drone', {x: 4, y: 4});
    enemyFactory('fighter', {x: -4, y: 4});
  }
}