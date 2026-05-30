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

      <div className="relative z-10 flex items-center justify-between py-0">
       
        {/* Logo */}
        <h1 className="ml-7 text-xl sm:text-2xl font-audiowide text-green-500 drop-shadow-[0_0_6px_rgba(0,255,0,0.9)] whitespace-nowrap">
          ASTEROIDS
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center justify-end">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <li key={label}> <Link to={href}
                    className={`uppercase tracking-[0.45em] text-sm hover:text-white inline-block px-4 sm:px-9 py-1 text-md sm:text-sm transition-all whitespace-nowrap rounded-sm border                   
                      ${isActive
                        ? 'border-[rgba(0,255,0,0.9)] text-cyan-300'
                        : ' text-[rgba(0,255,0,0.5)] border[rgba(0,255,0,0.5)]'
                      }`}>
                    {label}</Link></li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}