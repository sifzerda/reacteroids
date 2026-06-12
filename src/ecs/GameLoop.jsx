// src/ecs/GameLoop.jsx
// imports the systems

import { useFrame, useThree } from '@react-three/fiber';
import { shipControlSystem } from './systems/shipControlSystem';
import { weaponSystem } from './systems/weaponSystem';
import { exhaustSystem } from './systems/exhaustSystem';
import { wrapSystem } from './systems/wrapSystem';
import { shipCollisionSystem } from './systems/shipCollisionSystem';
import { bulletLifetimeSystem } from './systems/bulletLifetimeSystem';
import { exhaustLifetimeSystem } from './systems/exhaustLifetimeSystem';

import { gameSystems } from './systems/gameSystem';

export default function GameLoop({ onGameOver }) {
  const { viewport } = useThree();

useFrame((_, delta) => {

  shipControlSystem(delta);
  weaponSystem(delta);

  for (const system of gameSystems) {
    system(delta);
  }

  wrapSystem(viewport);

  shipCollisionSystem(delta, onGameOver);
  bulletLifetimeSystem(delta);
  exhaustSystem(delta);
  exhaustLifetimeSystem(delta);

});

  return null;
}