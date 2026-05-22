// src/components/PlayScreen.jsx

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';

import GameLoop from '../ecs/GameLoop';

import { startGame } from '../ecs/startGame';
import { resetGame } from '../ecs/resetGame';

import ShipRenderer from '../renderers/ShipRenderer';
import BulletRenderer from '../renderers/BulletRenderer';
import AsteroidRenderer from '../renderers/AsteroidRenderer';
import ExhaustRenderer from '../renderers/ExhaustRenderer';

import HUD from '../components/HUD';

export default function PlayScreen({ onGameOver }) {

  useEffect(() => {

    resetGame();
    startGame();

  }, []);

  return (
    <div className="relative w-full h-full">

      <HUD />

      <Canvas camera={{ position: [0, 0, 10] }}>

        <ambientLight intensity={1} />

        <GameLoop onGameOver={onGameOver} />

        <ShipRenderer />
        <BulletRenderer />
        <AsteroidRenderer />
        <ExhaustRenderer />

      </Canvas>

    </div>
  );
}