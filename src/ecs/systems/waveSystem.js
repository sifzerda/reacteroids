// src/ecs/systems/waveSystem.js
// this manages the level/stages of asteroid waves, and the difficulty scaling

import { gameState } from '../gameState';
import { asteroids } from '../queries';
import { spawnAsteroid } from '../factories/spawnAsteroid';

let spawningWave = false;

export function waveSystem() {

  // still asteroids alive
  if (asteroids.length > 0)
    return;

  // already spawning
  if (spawningWave)
    return;

  spawningWave = true;
  const count = gameState.asteroidsRequired;

  for (let i = 0; i < count; i++) {

    spawnAsteroid({

      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 18,

      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,

      radius:
        0.7 + Math.random() * 1.5,
    });
  }

  spawningWave = false;
}