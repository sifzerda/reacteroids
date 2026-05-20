// src/ecs/GameLoop.jsx

import { useFrame } from '@react-three/fiber';

import { shipSystem } from './systems/shipSystem';
import { weaponSystem } from './systems/weaponSystem';
import { movementSystem } from './systems/movementSystem';
import { bulletLifetimeSystem } from './systems/bulletLifetimeSystem';

export default function GameLoop() {

  useFrame((_, delta) => {

    shipSystem(delta);

    weaponSystem(delta);

    movementSystem(delta);

    bulletLifetimeSystem(delta);

  });

  return null;
}