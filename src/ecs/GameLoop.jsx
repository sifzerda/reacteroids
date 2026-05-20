// src/ecs/GameLoop.jsx

import { useFrame } from '@react-three/fiber';

import { shipSystem } from './systems/shipSystem';
import { weaponSystem } from './systems/weaponSystem';
import { movementSystem } from './systems/movementSystem';
import { bulletLifetimeSystem } from './systems/bulletLifetimeSystem';

import { asteroidSpawnSystem }
  from './systems/asteroidSpawnSystem';

import { asteroidSystem }
  from './systems/asteroidSystem';

  import { collisionSystem }
  from './systems/collisionSystem';

export default function GameLoop() {

  useFrame((_, delta) => {

    shipSystem(delta);

    weaponSystem(delta);

    movementSystem(delta);

    bulletLifetimeSystem(delta);

    asteroidSpawnSystem(delta);

    asteroidSystem(delta);

    collisionSystem();

  });

  return null;
}