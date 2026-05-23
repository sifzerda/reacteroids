// ecs/startGame.js

import { spawnShip }
  from './factories/spawnShip';

import { spawnAsteroid }
  from './factories/spawnAsteroid';

import { gameState }
  from './gameState';

export function startGame() {

  spawnShip();

  const count =
    gameState.waveAsteroidsTotal;

  for (let i = 0; i < count; i++) {

    spawnAsteroid({

      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 16,

      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,

      radius:
        0.7 + Math.random() * 1.5,

      size: 3,
    });
  }
}