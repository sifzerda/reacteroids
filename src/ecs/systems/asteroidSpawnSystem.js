// src/ecs/systems/asteroidSpawnSystem.js

import { spawnAsteroid }
  from '../factories/spawnAsteroid';

let timer = 0;

export function asteroidSpawnSystem(delta) {

  timer += delta;

  if (timer >= 1) {

    timer = 0;

    spawnAsteroid();
  }
}