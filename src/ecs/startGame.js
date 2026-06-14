// ecs/startGame.js
// initializes start game state

import { spawnShip, spawnAsteroid, spawnEnemy } from './spawn.js';
import { gameState } from './core/gameState';

export function startGame() {

  spawnShip();

  gameState.score = 0;
  gameState.wave = 1;
  gameState.waveProgress = 0;

  const asteroidCount = 8;

  gameState.waveProgressRequired = asteroidCount * 3;

  // Spawn asteroids
  for (let i = 0; i < asteroidCount; i++) {

    spawnAsteroid({

      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,

      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,

      radius: 0.7 + Math.random() * 1.5,
      size: 3,
    });
  }

  // Spawn enemies
spawnEnemy('drone', 4, 4);
spawnEnemy('fighter', -4, 4);
}