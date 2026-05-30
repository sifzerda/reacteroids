// components/Header.js
// header and nav combined

import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const pathname = useLocation().pathname;

  const links = [
    { href: '/', label: 'Game' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="relative border-b border-cyan-500/60 bg-black/65 shadow-[0_0_24px_rgba(57,255,20,0.2)] backdrop-blur-sm">
      {/* scanline overlay */}
      <div className="scanlines" />

      <div className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo */}
        <h1 className="text-lg sm:text-xl font-audiowide text-green-300 drop-shadow-[0_0_6px_rgba(0,255,0,0.9)] whitespace-nowrap">
          ASTEROIDS
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center justify-end gap-2 sm:gap-3">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <li key={label}>
                  <Link
                    to={href}
                    className={`
                      inline-block
                      px-2 sm:px-4
                      py-1
                      text-xs sm:text-sm
                      border
                      rounded-sm
                      transition-all
                      whitespace-nowrap

                      ${
                        isActive
                          ? 'border-cyan-400 text-cyan-300 shadow-[0_0_6px_#00eaff]'
                          : 'border-cyan-500/40 text-gray-400 hover:text-white hover:border-cyan-400'
                      }
                    `}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}