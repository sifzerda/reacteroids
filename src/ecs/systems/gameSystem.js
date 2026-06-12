// ecs/systems/gameSystems.js

import { enemySystem } from './enemySystem';
import { movementSystem } from './movementSystem';
import { collisionSystem } from './collisionSystem';
import { waveSystem } from './waveSystem';

export const gameSystems = [
  enemySystem,
  movementSystem,
  collisionSystem,
  waveSystem,
];