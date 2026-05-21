// src/ecs/GameLoop.jsx

import { useFrame } from '@react-three/fiber';

import { shipControlSystem }
  from './systems/shipControlSystem';

import { movementSystem }
  from './systems/movementSystem';

import { weaponSystem }
  from './systems/weaponSystem';

import { wrapSystem }
  from './systems/wrapSystem';

import { collisionSystem }
  from './systems/collisionSystem';

import { bulletLifetimeSystem }
  from './systems/bulletLifetimeSystem';

export default function GameLoop() {

  useFrame((_, delta) => {

    shipControlSystem(delta);

    weaponSystem(delta);

    movementSystem(delta);

    wrapSystem();

    collisionSystem();

    bulletLifetimeSystem(delta);
  });

  return null;
}