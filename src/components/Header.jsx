// components/Header.js

export default function Header() {
  return (
    <div className="py-1 text-center border-b border-cyan-500/60 bg-black/65 p-6 shadow-[0_0_24px_rgba(57,255,20,0.2)] backdrop-blur-sm">

      {/* scanline overlay */}
      <div className="scanlines" />

      <h1 className="text-xl font-audiowide text-green-300 drop-shadow-[0_0_6px_rgba(0,255,0,0.9)]">
        ASTEROIDS
      </h1>

    </div>
  );
}


