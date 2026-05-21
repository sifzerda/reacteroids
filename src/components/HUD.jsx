
import { useState, useEffect } from 'react';
import { ships } from '../ecs/queries.js';
import { gameState } from '../ecs/gameState.js';

export default function HUD() {

  const [ui, setUi] = useState({

    lives: 3,
    weapon: 'normal',
    score: 0,
  });

  useEffect(() => {

    const interval = setInterval(() => {

      const ship =
        ships.first;

      if (!ship) return;

      setUi({

        lives: ship.lives,
        weapon: ship.weapon,
        score: gameState.score,
      });

    }, 50);

    return () =>
      clearInterval(interval);

  }, []);

  return (

    <div
      style={{

        position: 'fixed',

        top: 20,
        left: 20,

        color: 'white',
        fontFamily: 'monospace',
        fontSize: '24px',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 100,
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

    </div>
  );
}