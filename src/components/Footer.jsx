// components/Footer.js

import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="relative w-full bg-black text-white border-t border-cyan-500/60 dual-border">

            <div className="py-1 text-center border-b border-cyan-500/60 bg-black/65 p-6 shadow-[0_0_24px_rgba(57,255,20,0.2)] backdrop-blur-sm">

                {/* scanline overlay */}
                <div className="scanlines" />

                <h1 className="flex items-center justify-center gap-2 text-xs font-audiowide text-green-300 drop-shadow-[0_0_6px_rgba(0,255,0,0.9)]">
                    <span> sifzerda</span>
                    <a
                        href="https://github.com/sifzerda/reacteroids"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-green-300 hover:text-cyan-300 transition">
                        <FaGithub className="text-base" />
                    </a>
                   <span>2026</span>
                </h1>

            </div>

        </footer>
    );
}





