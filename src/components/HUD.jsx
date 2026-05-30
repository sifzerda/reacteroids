// src/components/HUD.jsx
// in-game stats

import { useState, useEffect } from 'react';
import { ships } from '../ecs/queries.js';
import { gameState } from '../ecs/gameState.js';
import { gameEffects } from '../ecs/fx/gameEffects';

export default function HUD() {
  const [ui, setUi] = useState({
    lives: 3,
    weapon: 'raygun',
    score: 0,
    wave: 1,
    waveProgress: 0,
    bombProgress: 0,
    bombReady: false,
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
        bombProgress: gameState.bombCharge / gameState.bombChargeRequired,
        bombReady: gameState.bombReady,
        flash: gameEffects.screenShake,
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 12px',
        background: 'rgba(120, 180, 255, 0.08)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        borderBottom: '1px solid rgba(180, 220, 255, 0.18)',
        boxShadow: '0 0 28px rgba(120, 180, 255, 0.12)',
        fontFamily: 'monospace',
        color: '#d7ecff',
        zIndex: 50,
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
      {/* cream pixel texture overlay */}
<div
  style={{
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    opacity: 0.18,
    mixBlendMode: 'screen',
    backgroundImage: "url('/cream-pixels.png')",
    backgroundRepeat: 'repeat',
    backgroundSize: '180px 180px',
  }}
/>

      {/* glass highlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',

          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)',
        }}
      />

      {/* HUD content */}
      <div
        style={{
          position: 'relative',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          gap: 14,

          fontSize: 12,
          letterSpacing: 1,

          whiteSpace: 'nowrap',

          textShadow: '0 0 6px rgba(120,180,255,0.25)',
        }}
        >
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

        {/* BOMB */}
        <span
          style={{
            color: ui.bombReady ? '#bff6ff' : '#d7ecff',
            textShadow: ui.bombReady
              ? '0 0 10px rgba(180,240,255,0.7)'
              : '0 0 6px rgba(120,180,255,0.25)',
          }}
        >
          BOMB {Math.floor(ui.bombProgress * 100)}%
        </span>
      </div>
    </div>
  );
}