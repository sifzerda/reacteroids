//src/ecs/destroyAsteroid.js
// this is the shared/collective function that destroys an asteroid

import { world }
  from './world.js'

import { gameState }
  from './gameState';

import { spawnAsteroid }
  from './factories/spawnAsteroid';

export function destroyAsteroid(
  asteroid,
  scoreValue = 100,
  giveBombCharge = true
) {

  world.remove(asteroid);

  // SCORE

  gameState.score += scoreValue;

  // PROGRESS VALUE

  let progressValue = 0;

  if (asteroid.size === 3) {

    progressValue = 1;
  }
  else if (asteroid.size === 2) {

    progressValue = 0.5;
  }
  else if (asteroid.size === 1) {

    progressValue = 0.25;
  }

  gameState.waveProgress +=
    progressValue;

  // BOMB CHARGE

  // BOMB CHARGE

  if (giveBombCharge) {

    gameState.bombCharge += 15;

    if (
      gameState.bombCharge >=
      gameState.bombChargeRequired
    ) {

      gameState.bombCharge =
        gameState.bombChargeRequired;

      gameState.bombReady = true;
    }
  }

  // SPLIT ASTEROIDS

  if (asteroid.size > 1) {

    for (let i = 0; i < 2; i++) {

      const angle =
        Math.random() *
        Math.PI *
        2;

      const speed =
        1 + Math.random() * 2;

      spawnAsteroid({

        x: asteroid.x,
        y: asteroid.y,

        vx:
          Math.cos(angle) * speed,

        vy:
          Math.sin(angle) * speed,

        radius:
          asteroid.radius * 0.6,

        size:
          asteroid.size - 1,
      });
    }
  }
}