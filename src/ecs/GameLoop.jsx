// src/ecs/GameLoop.jsx

import { useFrame } from '@react-three/fiber';
import { shipControlSystem } from './systems/shipControlSystem';
import { movementSystem } from './systems/movementSystem';
import { weaponSystem } from './systems/weaponSystem';
import { wrapSystem } from './systems/wrapSystem';
import { collisionSystem } from './systems/collisionSystem';
import { bulletLifetimeSystem } from './systems/bulletLifetimeSystem';
import { exhaustLifetimeSystem } from './systems/exhaustLifetimeSystem';
import { shipCollisionSystem } from './systems/shipCollisionSystem';
import { exhaustSystem } from './systems/exhaustSystem';

export default function GameLoop({
  onGameOver,
}) {

  useFrame((_, delta) => {

    shipControlSystem(delta);
    weaponSystem(delta);
    exhaustSystem(delta);
    movementSystem(delta);

    wrapSystem();
    collisionSystem();
    
    shipCollisionSystem(delta, onGameOver);
    bulletLifetimeSystem(delta);
    exhaustLifetimeSystem(delta);
  });

  return null;
}