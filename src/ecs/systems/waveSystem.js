// src/ecs/systems/waveSystem.js
// this manages the level/stages of asteroid waves, and the difficulty scaling

import { gameState } from '../gameState';
import { spawnAsteroid } from '../factories/spawnAsteroid';

let waveCooldown = 0;

export function waveSystem() {
  waveCooldown--;

  if (waveCooldown > 0) return;
  // count living asteroids

  // wave still active

  if (gameState.waveProgress < gameState.waveProgressRequired) {
    return;
  }

  // NEXT WAVE
  gameState.wave++;
  const count = 7 + gameState.wave;

  // reset progress
  gameState.waveProgress = 0;

  // each asteroid tree = 3
  gameState.waveProgressRequired = count * 3;

  for (let i = 0; i < count; i++) {

    const angle = Math.random() * Math.PI * 2;
    const distance = 10 + Math.random() * 4;

    spawnAsteroid({

      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,

      vx: (Math.random() - 0.5) * (2 + gameState.wave * 0.15),
      vy: (Math.random() - 0.5) * (2 + gameState.wave * 0.15),

      radius: 0.7 + Math.random() * 1.5,
      size: 3,
    });

  }
  // prevent instant duplicate spawn
  waveCooldown = 30;

}