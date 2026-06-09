// src/ecs/GameLoop.jsx
// imports the systems

import { useFrame, useThree } from '@react-three/fiber';
import { shipControlSystem } from './systems/shipControlSystem';
import { movementSystem } from './systems/movementSystem';
import { weaponSystem } from './features/weaponSystem.js'
import { wrapSystem } from './systems/wrapSystem';
import { collisionSystem } from './systems/collisionSystem';
import { bulletLifetimeSystem } from './systems/bulletLifetimeSystem';
import { exhaustLifetimeSystem } from './systems/exhaustLifetimeSystem';
import { shipCollisionSystem } from './systems/shipCollisionSystem';
import { exhaustSystem } from './systems/exhaustSystem';
import { waveSystem } from './systems/waveSystem';

import { features } from './features';

export default function GameLoop({ onGameOver }) {
  const { viewport } = useThree();

  useFrame((_, delta) => {

    shipControlSystem(delta);
    weaponSystem(delta);
    exhaustSystem(delta);
    movementSystem(delta);

    //features folder
    for (const feature of features) {
      if (!feature.systems) continue;
      for (const system of feature.systems) {
        system(delta);
      }
    }
    ////
    wrapSystem(viewport);

    collisionSystem();
    waveSystem();

    shipCollisionSystem(delta, onGameOver);
    bulletLifetimeSystem(delta);
    exhaustLifetimeSystem(delta);
  });

  return null;
}