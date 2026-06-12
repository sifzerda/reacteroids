// ecs/systems/gameSystems.js

import { enemySystem } from './enemySystem';
import { asteroidSystem } from './asteroidSystem';
import { movementSystem } from './movementSystem';
import { collisionSystem } from './collisionSystem';
import { waveSystem } from './waveSystem';

export const gameSystems = [ asteroidSystem, enemySystem, movementSystem, collisionSystem, waveSystem ];