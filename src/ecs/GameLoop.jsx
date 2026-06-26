// src/ecs/GameLoop.jsx
// imports the systems

import { useFrame, useThree } from '@react-three/fiber';
import { shipControlSystem } from './systems/shipControlSystem';
import { weaponSystem } from './systems/weaponSystem';
import { wrapSystem } from './systems/wrapSystem';
import { shipCollisionSystem } from './systems/shipCollisionSystem';
import { inputSystem } from './systems/inputSystem';
import { gameSystems } from './systems/gameSystems';
import { asteroids } from './core/queries';
import { clearSpatialGrid, insertIntoSpatialGrid } from './shared/spatialGrid.js';

export default function GameLoop({ onGameOver }) {
  const { viewport } = useThree();

useFrame((_, delta) => {
  delta = Math.min(delta, 1 / 60);

  shipControlSystem(delta);
    weaponSystem(delta);

    for (const system of gameSystems) {
      system(delta);
    }
    
    clearSpatialGrid();
    for (const asteroid of asteroids) {
      insertIntoSpatialGrid(asteroid);
    }

    wrapSystem(viewport);
    shipCollisionSystem(delta, onGameOver);
    inputSystem();
  });

  return null;
}