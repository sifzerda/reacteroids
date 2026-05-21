// src/components/Play.jsx

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import GameLoop from '../ecs/GameLoop';

import { spawnShip } from '../ecs/factories/spawnShip';
import { spawnAsteroid } from '../ecs/factories/spawnAsteroid';
import ShipRenderer from '../renderers/ShipRenderer';
import BulletRenderer from '../renderers/BulletRenderer';
import AsteroidRenderer from '../renderers/AsteroidRenderer';

export default function Play() {

  useEffect(() => {

    // PLAYER

    spawnShip();

    // STARTING ASTEROIDS

    for (let i = 0; i < 8; i++) {

      spawnAsteroid({

        x:
          (Math.random() - 0.5) * 16,

        y:
          (Math.random() - 0.5) * 16,

        vx:
          (Math.random() - 0.5) * 2,

        vy:
          (Math.random() - 0.5) * 2,

        radius:
          0.7 + Math.random() * 1.5,
      });
    }

  }, []);

  return (

    <Canvas
      camera={{
        position: [0, 0, 10],
        fov: 60,
      }}>

      {/* LIGHTING */}
      <ambientLight intensity={1} />

      {/* ECS */}
      <GameLoop />

      {/* RENDERERS */}
      <ShipRenderer />
      <BulletRenderer />
      <AsteroidRenderer />

    </Canvas>
  );
}