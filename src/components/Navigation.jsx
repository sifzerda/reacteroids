// components/Navigation.jsx

import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const pathname = useLocation().pathname;

  const links = [
    { href: '/', label: 'Game' },
    { href: '/about', label: 'About' },
  ];

  return (
    <nav className="w-full bg-black text-white">
      <div className="h-0.5 bg-blue-900 w-full" />
      <div className="flex justify-center py-3">
        <ul className="flex gap-3">
          {links.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <li key={label}>
                <Link to={href} className={`
                    px-4 py-1 text-sm border rounded-sm transition-all inline-block
                    ${isActive
                      ? 'border-cyan-400 text-cyan-300 shadow-[0_0_6px_#00eaff]'
                      : 'border-cyan-500/40 text-gray-400 hover:text-white hover:border-cyan-400'}
                  `}>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}