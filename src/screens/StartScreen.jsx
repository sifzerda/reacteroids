// ecs/screens/StartScreen.jsx

import FlightLayout from '../components/FlightLayout2';
import { useState, useEffect } from 'react';

export default function StartScreen({
  onPlay,
  onHowToPlay,
  onSettings,
  onHighscores,
}) {

  const [selected, setSelected] = useState(0);

  const items = [
    { label: 'PLAY', action: onPlay },
    { label: 'HOW TO PLAY', action: onHowToPlay },
    { label: 'SETTINGS', action: onSettings },
    { label: 'HIGHSCORES', action: onHighscores },
  ];

  // keyboard navigation (arcade feel)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') setSelected((s) => (s + 1) % items.length);
      if (e.key === 'ArrowUp') setSelected((s) => (s - 1 + items.length) % items.length);
      if (e.key === 'Enter') items[selected].action();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <FlightLayout title="ASTEROIDS" footer="SECTOR CLEAR">

      {/* ================= RADAR BACKGROUND ================= */}
     <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-80">

  {/* sweep (reduced brightness) */}
  <div className="radar-sweep absolute w-[420px] h-[420px] rounded-full overflow-hidden opacity-80">
    <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(0,255,255,0.0),rgba(0,255,255,0.18),rgba(0,255,255,0.0))]" />
  </div>

  {/* rings */}
  <div className="absolute w-[420px] h-[420px] rounded-full border border-green-500/40" />
  <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-400/40" />
  <div className="absolute w-[180px] h-[180px] rounded-full border border-cyan-400/40" />

  {/* cross lines */}
  <div className="absolute w-[420px] h-px bg-cyan-400/5" />
  <div className="absolute w-px h-[420px] bg-cyan-400/5" />

</div>

      {/* ================= MENU ================= */}
      <div className="relative z-10 mt-10 flex flex-col items-center gap-4 font-mono">

        {items.map((item, i) => {
          const active = i === selected;

          return (
            <button
              key={item.label}
              onClick={item.action}
              onMouseEnter={() => setSelected(i)}
              className={`
                relative w-56 py-3 uppercase tracking-[0.45em] text-sm

                border transition-all duration-200

                ${active
                  ? "border-cyan-300 text-white bg-cyan-500/10 shadow-[0_0_18px_rgba(0,255,255,0.35)]"
                  : "border-[#39ff14]/40 text-[#39ff14]/70 bg-black/40"
                }
              `}
            >
              {item.label}

              {active && (
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-cyan-300 animate-pulse">
                  ▶
                </span>
              )}
            </button>
          );
        })}

      </div>

    </FlightLayout>
  );
}