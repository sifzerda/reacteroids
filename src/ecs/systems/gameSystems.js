// ecs/systems/gameSystems.js

import { enemySystem } from './enemySystem';
import { asteroidSystem } from './asteroidSystem';
import { movementSystem } from './movementSystem';
import { collisionSystem } from './collisionSystem';
import { waveSystem } from './waveSystem';
import { missileSystem } from './missileSystem';

import { bulletLifetimeSystem } from './bulletLifetimeSystem';
import { beamLifetimeSystem } from './beamLifetimeSystem';
import { exhaustSystem } from './exhaustSystem';
import { exhaustLifetimeSystem } from './exhaustLifetimeSystem';

export const gameSystems = [
  asteroidSystem,
  enemySystem,
  movementSystem,
  collisionSystem,
  missileSystem,
  waveSystem,

  bulletLifetimeSystem,
  beamLifetimeSystem,
  exhaustSystem,
  exhaustLifetimeSystem,
];