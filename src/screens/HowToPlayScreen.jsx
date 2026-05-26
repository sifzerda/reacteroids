// ecs/screens/HowToPlayScreen.jsx

import FlightLayout from '../components/FlightLayout2';

export default function HowToPlayScreen({
  onBack,
}) {

  return (

    <FlightLayout
      title="HOW TO PLAY"
      footer="SECTOR CLEAR"
    >

  <div className="mx-auto inline-block text-left font-mono text-xs tracking-[0.2em] text-white/80">

        <div className="space-y-4">

          {/* MOVEMENT */}
          <div>
            <div className="mb-2 text-[#39ff14]/60 tracking-[0.25em]">
              MOVEMENT
            </div>

            <div className="flex items-center gap-5">

              {/* WASD GRID */}
              <div className="grid grid-cols-3 grid-rows-2 gap-1">
                <div />

                <div className="flex h-8 w-8 items-center justify-center border border-white/40 text-white text-xs">
                  W
                </div>

                <div />

                <div className="flex h-8 w-8 items-center justify-center border border-white/40 text-white text-xs">
                  A
                </div>

                <div className="flex h-8 w-8 items-center justify-center border border-white/40 text-white text-xs">
                  S
                </div>

                <div className="flex h-8 w-8 items-center justify-center border border-white/40 text-white text-xs">
                  D
                </div>
              </div>

              <span className="text-white/70">
                Move ship in all directions
              </span>
            </div>
          </div>

          {/* SPECIAL */}
          <div>
            <div className="mb-2 text-[#39ff14]/60 tracking-[0.25em]">
              SHOOTING
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-7 w-14 items-center justify-center border border-white/40 text-white text-[10px]">
                SPACE
              </div>

              <span className="text-white/70">
                Fire gun 
              </span>
            </div>
          </div>

                    {/* SPECIAL */}
          <div>
            <div className="mb-2 text-[#39ff14]/60 tracking-[0.25em]">
              SPECIAL WEAPON
            </div>

            <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center border border-white/40 text-white text-xs">
                  B
                </div>

              <span className="text-white/70">
                Release bomb (when bomb meter is full)
              </span>
            </div>
          </div>

        </div>

        {/* BACK BUTTON */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onBack}
            className="border border-[#39ff14]/60 px-5 py-2 text-[#39ff14] tracking-[0.3em] hover:bg-[#39ff14]/10 transition"
          >
            BACK
          </button>
        </div>

      </div>

    </FlightLayout>

  );
}

