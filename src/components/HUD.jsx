// src/components/HUD.jsx
// in-game stats

import { useState, useEffect } from 'react';
import { ships } from '../ecs/core/queries.js';
import { gameState } from '../ecs/core/gameState.js';

export default function HUD() {
  const [ui, setUi] = useState({
    lives: 3,
    weapon: 'RAY GUN',
    score: 0,
    wave: 1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const ship = ships.first;
      if (!ship) return;

      setUi({
        lives: ship.lives,
        weapon: ship.weapon.toUpperCase(),
        score: gameState.score,
        wave: gameState.wave,
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-50">

      {/* top holographic line */}
      <div className="h-px w-full bg-cyan-400/70 shadow-[0_0_12px_#22d3ee]" />

      {/* scan line */}
      <div className="absolute inset-0 h-full opacity-10">
        <div className="h-full bg-[repeating-linear-gradient(180deg,transparent_0px,transparent_3px,rgba(255,255,255,.18)_4px)]" />
      </div>

      <div className="
  mx-auto mt-1
  flex max-w-[95vw] flex-wrap items-center justify-center
  gap-2 sm:gap-3
  rounded-md
  border border-cyan-400/30
  bg-black/20
  px-2 sm:px-3
  py-0.5
  backdrop-blur-sm
  shadow-[0_0_18px_rgba(0,255,255,.14)]
">
        <HudBlock
          label="LIVES"
          value={ui.lives}
          color="text-red-400"
        />

        <Divider />

        <HudBlock
          label="SCORE"
          value={ui.score.toLocaleString()}
          color="text-cyan-300"
        />

        <Divider />

        <HudBlock
          label="WAVE"
          value={ui.wave}
          color="text-yellow-300"
        />

        <Divider />

        <HudBlock
          label="WEAPON"
          value={ui.weapon}
          color="text-green-300"
        />

      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="hidden h-7 w-px bg-cyan-400/30 sm:block" />
  );
}

function HudBlock({ label, value, color }) {
  return (
    <div className="relative min-w-17.5 sm:min-w-22.5">

      {/* corner brackets */}
      <div className="absolute left-0 top-0 h-2 w-2 border-l border-t border-cyan-400/60" />
      <div className="absolute right-0 top-0 h-2 w-2 border-r border-t border-cyan-400/60" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-l border-b border-cyan-400/60" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-r border-b border-cyan-400/60" />

      <div className="px-2 py-0 text-center font-mono leading-none">

        <div
          className="
    text-[12px] sm:text-[16px] md:text-[18px]
    font-semibold
    tracking-[0.18em]
    uppercase
    text-cyan-300/70
  "
        >
          {label}
        </div>

        <div
          className={`
    text-sm sm:text-base md:text-lg
    font-bold
    tracking-[0.08em]
    drop-shadow-[0_0_5px_currentColor]
    ${color}
  `}
        >
          {value}
        </div>

      </div>

    </div>
  );
}