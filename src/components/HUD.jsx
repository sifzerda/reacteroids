// src/components/HUD.jsx
// in-game stats

import { useState, useEffect } from 'react';
import { ships } from '../ecs/core/queries.js';
import { gameState } from '../ecs/core/gameState.js';

export default function HUD() {
  const [ui, setUi] = useState({
    lives: 3,
    weapon: 'raygun',
    score: 0,
    wave: 1,
    waveProgress: 0,
    flash: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const ship = ships.first;
      if (!ship) return;

      setUi({
        lives: ship.lives,
        weapon: ship.weapon,
        score: gameState.score,
        wave: gameState.wave,
        waveProgress: Math.min(gameState.waveProgress / gameState.waveProgressRequired, 1),
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-x-0 top-0 z-50 h-13
        flex items-center justify-center px-3
        font-mono text-[#d7ecff] select-none
        pointer-events-none backdrop-blur-[1px]
        border-b border-[rgba(180,220,255,0.18)] shadow-[0_0_28px_rgba(120,180,255,0.12)]
        bg-[rgba(120,180,255,0.08)]">
      {/* cream pixel texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.18] mix-blend-screen bg-repeat"
        style={{ backgroundImage: "url('/cream-pixels.png')", backgroundSize: '180px 180px' }} />

      {/* glass highlight */}
      <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-white/10 to-transparent" />

      {/* HUD content */}
      <div className="relative flex items-center justify-center gap-3.5 text-[12px] tracking-[1px] whitespace-nowrap">
        {/* LIVES */}
        <span>
          LIVES: {ui.lives}
        </span>

        {/* SCORE */}
        <span>
          SCORE: {ui.score.toLocaleString()}
        </span>

        {/* WAVE */}
        <span>
          WAVE: {ui.wave}
        </span>

      </div>
    </div>
  );
}