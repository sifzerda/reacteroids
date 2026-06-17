// src/components/PlayScreen.jsx

import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

import GameLoop from '../ecs/GameLoop';

import { startGame } from '../ecs/startGame';
import { resetGame } from '../ecs/resetGame';

import ShipRenderer from '../renderers/ShipRenderer';
import BulletRenderer from '../renderers/BulletRenderer';
import AsteroidRenderer from '../renderers/AsteroidRenderer';
import ExhaustRenderer from '../renderers/ExhaustRenderer';
import EnemyRenderer from '../renderers/EnemyRenderer';
// special weapon projectiles
import BeamRenderer from '../renderers/BeamRenderer';
import MissileRenderer from '../renderers/MissileRenderer';
import ChargeEffectRenderer from '../renderers/ChargeEffectRenderer';

import MouseWorldTracker from '../ecs/core/MouseWorldTracker';
 
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

        <MouseWorldTracker />

        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        <GameLoop onGameOver={onGameOver} />
        <ShipRenderer />
        <BulletRenderer />
        
        <BeamRenderer />
        <ChargeEffectRenderer />
        <MissileRenderer />

        <EnemyRenderer />
        <AsteroidRenderer />
        <ExhaustRenderer />

        <EffectComposer>

          <Bloom intensity={2.5} luminanceThreshold={0.02} luminanceSmoothing={0.2} mipmapBlur />
          <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0015, 0.0012]} />
          <Noise opacity={0.025} />
          <Vignette eskil={false} offset={0.12} darkness={0.9} />

        </EffectComposer>

      </Canvas>

    </div>
  );
}