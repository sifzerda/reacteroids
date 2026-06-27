 // ecs/systems/gameSystems.js

import { asteroidSystem } from './asteroidSystem';
import { movementSystem } from './movementSystem';
import { collisionSystem } from './collisionSystem';
import { waveSystem } from './waveSystem';
import { missileSystem } from './missileSystem';
import { bulletLifetimeSystem } from './bulletLifetimeSystem';
import { beamLifetimeSystem } from './beamLifetimeSystem';
import { particleLifetimeSystem } from './particleLifetimeSystem';

export const gameSystemsBeforeGrid = [
  asteroidSystem,
  movementSystem,
];

export const gameSystemsAfterGrid = [
  collisionSystem,
  missileSystem,
  waveSystem,
  bulletLifetimeSystem,
  beamLifetimeSystem,
  particleLifetimeSystem,
];