// components/Asteroids.js

import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

import Ship from './Ship';
import Rocks from './Rocks';
import BulletSystem from './BulletSystem';
import WeaponSystem from './WeaponSystem';
import FXSystem from './FXSystem';
export default function Asteroids() {
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [combo, setCombo] = useState(1);
  const [difficulty, setDifficulty] = useState(1);
  const [popupQueue, setPopupQueue] = useState([]);
  const [score, setScore] = useState(0);
  const [size, setSize] = useState({ width: 600, height: 600 });

  const bulletsRef = useRef();
  const fxRef = useRef();
  const shipDataRef = useRef();
  const containerRef = useRef();

  // canvas sizing
  useEffect(() => {
    const container = containerRef.current;
    const updateSize = () => {
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      setSize({ width, height });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => { window.removeEventListener('resize', updateSize) };
  }, []);

  // passive score ticking
  useEffect(() => {
    if (lives <= 0) return;

    const interval = setInterval(() => {
      setScore((prev) => { return ( prev +  Math.floor( 1 + prev / 3000 )) });
      setCombo((c) => Math.max(1, c - 0.05));
    }, 100);

    return () => clearInterval(interval);
  }, [lives]);

  return (
    <div ref={containerRef}
      className="w-full max-w-4xl mx-auto mt-4 relative"
      style={{ aspectRatio: '1 / 1' }}>
      {/* HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
        <div className="flex justify-between items-start font-mono tracking-widest">
          {/* LEFT */}
          <div className="flex flex-col gap-1 text-left">
            <div className="text-cyan-300 text-2xl">SCORE</div>

            <div className="text-cyan-100 text-4xl font-bold">
              {Math.floor(score)
                .toString()
                .padStart(6, '0')}
            </div>

            <div className="text-yellow-300 text-lg">COMBO x {combo.toFixed(1)}</div>
          </div>

          {/* CENTER */}
          <div className="flex flex-col items-center">
            <div className="text-cyan-200 text-4xl tracking-[0.35em]">ASTEROIDS</div>
            <div className="text-cyan-500 text-lg mt-1">WAVE {wave}</div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-1 text-right">
            <div className="text-pink-400 text-2xl">LIVES</div>

            <div className="text-pink-200 text-4xl font-bold">{lives}</div>

            <div className="text-orange-300 text-lg">DANGER{' '}
              {( difficulty * 100 ).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* GAME OVER */}
      {lives <= 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6 font-mono">
            <div className="text-red-500 text-7xl font-bold tracking-[0.3em] animate-pulse">GAME OVER</div>

            <div className=" text-cyan-400 text-2xl tracking-[0.25em]">FINAL SCORE</div>
            <div className="text-yellow-300 text-7xl font-bold">{Math.floor(score)}</div>
            <div className="text-cyan-500 text-2xl">WAVE REACHED:{' '} {wave}</div>
            <div className="text-pink-400 text-xl">MAX COMBO: x {combo.toFixed(1)}</div>
          </div>
        </div>
      )}

      {/* SCORE POPUPS */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        {popupQueue.map((p) => (
          <div key={p.id}
            className="absolute font-mono font-bold text-yellow-300"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
              textShadow: '0 0 12px #fde047',
              animation: 'popupFloat 0.8s ease-out forwards',
            }}>
            +{p.value}
          </div>
        ))}
      </div>

      <Canvas
        tabIndex={0}
        onClick={(e) => e.target.focus()}
        camera={{ position: [0, 0, 10] }}
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          background: 'black',
          border: '1px solid cyan',
          boxSizing: 'border-box',
        }}>
        <ambientLight intensity={0.4} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={1.2} />

        {/* SHIP */}
        <Ship
          shipDataRef={shipDataRef}
          lives={lives}
          fxRef={fxRef} />

        {/* BULLETS */}
        <BulletSystem ref={bulletsRef} />

        {/* WEAPONS */}
        <WeaponSystem
          shipDataRef={shipDataRef}
          bulletsRef={bulletsRef}
          fxRef={fxRef} />

        {/* FX */}
        <FXSystem ref={fxRef} />

        {/* ASTEROIDS */}
        <Rocks
          bulletsRef={bulletsRef}
          shipDataRef={shipDataRef}
          fxRef={fxRef}
          setLives={setLives}
          lives={lives}
          score={score}
          setScore={setScore}
          combo={combo}
          setCombo={setCombo}
          wave={wave}
          setWave={setWave}
          difficulty={difficulty}
          setPopupQueue={setPopupQueue}
           />

        <EffectComposer>
          <Bloom
            selectionLayer={1}
            intensity={1.2}
            luminanceThreshold={0.6}
            luminanceSmoothing={0.2} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}