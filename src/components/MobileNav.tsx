import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MOBILE_NAV_ITEMS } from './Sidebar';
import { useAppData } from '../hooks/AppDataContext';

const PRIMARY = MOBILE_NAV_ITEMS.slice(0, 4);
const OVERFLOW = MOBILE_NAV_ITEMS.slice(4);

export function MobileNav() {
  const { data } = useAppData();
  const accent = data.settings.accentShade;
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const overflowActive = OVERFLOW.some((item) => item.to === location.pathname);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-burgundy/25 backdrop-blur-sm lg:hidden"
          onClick={() => setMoreOpen(false)}
          role="presentation"
        />
      )}
      <div
        className={`fixed inset-x-0 bottom-16 z-50 mx-4 origin-bottom rounded-3xl bg-cream p-3 shadow-[var(--shadow-lift)] transition-all duration-200 lg:hidden ${
          moreOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        <div className="grid grid-cols-2 gap-2">
          {OVERFLOW.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMoreOpen(false)}
              style={({ isActive }) => (isActive ? { backgroundColor: accent } : undefined)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-2xl px-3.5 py-3 text-sm font-medium transition ${
                  isActive ? 'text-white' : 'bg-blush-50 text-blush-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center justify-around border-t border-blush-150 bg-cream/95 backdrop-blur lg:hidden"
        aria-label="Main navigation"
      >
        {PRIMARY.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium"
          >
            {({ isActive }) => (
              <>
                <span className="rounded-full p-1.5" style={isActive ? { backgroundColor: accent } : undefined}>
                  <Icon active={isActive} />
                </span>
                <span className={isActive ? 'text-blush-800' : 'text-blush-500'}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen((v) => !v)}
          className="flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium"
          aria-expanded={moreOpen}
          aria-label="More navigation options"
        >
          <span className="rounded-full p-1.5" style={overflowActive || moreOpen ? { backgroundColor: accent } : undefined}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="4.5" cy="10" r="1.4" fill={overflowActive || moreOpen ? 'white' : '#954059'} />
              <circle cx="10" cy="10" r="1.4" fill={overflowActive || moreOpen ? 'white' : '#954059'} />
              <circle cx="15.5" cy="10" r="1.4" fill={overflowActive || moreOpen ? 'white' : '#954059'} />
            </svg>
          </span>
          <span className={overflowActive || moreOpen ? 'text-blush-800' : 'text-blush-500'}>More</span>
        </button>
      </nav>
    </>
  );
}
