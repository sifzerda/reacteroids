// src/ecs/systems/waveSystem.js
// this manages the level/stages of asteroid waves, and the difficulty scaling

import { gameState } from '../gameState';
import { asteroids } from '../queries';
import { spawnAsteroid } from '../factories/spawnAsteroid';

let spawningWave = false;

export function waveSystem() {

  // count manually

  let asteroidCount = 0;

  for (const asteroid of asteroids) {
    asteroidCount++;
  }

  // still asteroids alive

  if (asteroidCount > 0)
    return;

  // prevent duplicate spawning

  if (spawningWave)
    return;

  spawningWave = true;

  const count =
    gameState.asteroidsRequired;

  for (let i = 0; i < count; i++) {

    const angle =
      Math.random() * Math.PI * 2;

    const distance =
      10 + Math.random() * 4;

    spawnAsteroid({

      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,

      vx: (Math.random() - 0.5) * (2 + gameState.wave * 0.15),
      vy: (Math.random() - 0.5) * (2 + gameState.wave * 0.15),

      radius:
        0.7 + Math.random() * 1.5,

      size: 3,
    });
  }

  spawningWave = false;
}