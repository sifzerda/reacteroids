// src/ecs/systems/waveSystem.js
// this manages the level/stages of asteroid waves, and the difficulty scaling

import { gameState }
  from '../gameState';

import { asteroids }
  from '../queries';

import { spawnAsteroid }
  from '../factories/spawnAsteroid';

let spawningWave = false;
let waveCooldown = 0;

export function waveSystem() {
  waveCooldown--;

  if (waveCooldown > 0)
    return;
  // count living asteroids

  let asteroidCount = 0;

  for (const asteroid of asteroids) {
    asteroidCount++;
  }

  // wave still active

  if (asteroidCount > 0)
    return;

  // avoid duplicate spawning

  if (spawningWave)
    return;

  spawningWave = true;

  // NEXT WAVE

  gameState.wave++;

  const count =
    7 + gameState.wave;

  gameState.waveAsteroidsTotal =
    count;

  gameState.waveAsteroidsRemaining =
    count;

  for (let i = 0; i < count; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      10 + Math.random() * 4;

    spawnAsteroid({

      x:
        Math.cos(angle) * distance,

      y:
        Math.sin(angle) * distance,

      vx:
        (Math.random() - 0.5) *
        (2 + gameState.wave * 0.15),

      vy:
        (Math.random() - 0.5) *
        (2 + gameState.wave * 0.15),

      radius:
        0.7 + Math.random() * 1.5,

      size: 3,
    });

  }
  waveCooldown = 30;
  spawningWave = false;
}