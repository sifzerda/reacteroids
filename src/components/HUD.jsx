// src/components/HUD.jsx
import { useState, useEffect } from 'react';
import { ships } from '../ecs/queries.js';
import { gameState } from '../ecs/gameState.js';
import { gameEffects } from '../ecs/effects/gameEffects';

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

        waveProgress:
          gameState.asteroidsDestroyed /
          gameState.asteroidsRequired,

        bombProgress:
          gameState.bombCharge /
          gameState.bombChargeRequired,

        bombReady: gameState.bombReady,

        flash: gameEffects.screenShake,
      });

    }, 50);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div style={{

      position: 'fixed',

      top: 20,
      left: 20,

      color: 'white',

      fontFamily: 'monospace',
      fontSize: '24px',

      pointerEvents: 'none',
      userSelect: 'none',

      zIndex: 100,
      width: 320,
    }}>

      <div>
        LIVES: {ui.lives}
      </div>

      <div>
        WEAPON: {ui.weapon}
      </div>

      <div>
        SCORE: {ui.score}
      </div>

      <div style={{ marginTop: 12 }}>
        WAVE: {ui.wave}
      </div>

      {/* WAVE BAR */}

      <div style={{

        width: '100%',
        height: 18,
        border: '2px solid white',
        marginTop: 8,
      }}>

        <div style={{

          width: `${ui.waveProgress * 100}%`,
          height: '100%',
          background: 'white',
          transition: 'width 0.15s linear',
        }}
        />

      </div>

      <div style={{
        fontSize: 16,
        marginTop: 4,
      }}>

        ASTEROIDS CLEARED

      </div>

      {/* BOMB BAR */}

      <div style={{

        width: '100%',
        height: 18,
        border: '2px solid cyan',
        marginTop: 20,
      }}>

        <div style={{

          width: `${ui.bombProgress * 100}%`,
          height: '100%',
          background: ui.bombReady
            ? 'cyan'
            : 'white',
          transition: 'width 0.1s linear',
        }}
        />

      </div>

      <div style={{
        fontSize: 16,
        marginTop: 4,
      }}>

        {ui.bombReady
          ? 'BOMB READY [B]'
          : 'CHARGING BOMB'}

      </div>

      <div
        style={{

          position: 'fixed',
          inset: 0,
          background: 'red',
          opacity: ui.flash * 0.25,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          zIndex: 999,
        }}
      />

    </div>
  );
}