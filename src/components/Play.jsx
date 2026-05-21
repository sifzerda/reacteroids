// src/components/Play.jsx

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { spawnShip } from '../ecs/factories/spawnShip';

import GameLoop from '../ecs/GameLoop';
import ShipRenderer from '../renderers/ShipRenderer';
import BulletRenderer from '../renderers/BulletRenderer';
import AsteroidRenderer from '../renderers/AsteroidRenderer';

export default function Play() {

  useEffect(() => {
    spawnShip();
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <ambientLight intensity={1} />

      <GameLoop />
      <ShipRenderer />
      <BulletRenderer />
      <AsteroidRenderer />

    </Canvas>
  );
}