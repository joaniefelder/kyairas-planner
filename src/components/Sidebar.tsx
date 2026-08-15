import { NavLink } from 'react-router-dom';
import { useAppData } from '../hooks/AppDataContext';
import { WildflowerSprig } from './Flowers';

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarIcon },
  { to: '/todo', label: 'To-Do List', icon: CheckIcon },
  { to: '/classes', label: 'Classes', icon: BookIcon },
  { to: '/deadlines', label: 'Deadlines', icon: ClockIcon },
  { to: '/notes', label: 'Notes', icon: NoteIcon },
  { to: '/verse', label: 'Bible Verse', icon: HeartIcon },
  { to: '/settings', label: 'Settings', icon: GearIcon },
];

export function Sidebar() {
  const { data } = useAppData();
  return (
    <aside className="relative hidden w-64 shrink-0 flex-col border-r border-blush-150/70 bg-gradient-to-b from-white/80 to-blush-50/60 px-5 py-7 lg:flex">
      <div className="mb-8 px-2">
        <h1 className="font-script text-3xl leading-tight text-blush-800">{data.settings.displayName || 'Kyaira Jordan'}</h1>
        <p className="mt-0.5 flex items-center gap-1 font-serif text-sm text-blush-500">
          her planner <span aria-hidden>♡</span>
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => (isActive ? { backgroundColor: data.settings.accentShade } : undefined)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive ? 'text-white shadow-[var(--shadow-soft)]' : 'text-blush-700 hover:bg-blush-100/80 hover:text-blush-900'
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
      </nav>

      <div className="relative mt-6 h-24 opacity-90">
        <WildflowerSprig className="absolute -bottom-4 left-2 h-28 w-28" />
      </div>
    </aside>
  );
}

type IconProps = { active?: boolean };

function iconStroke(active?: boolean) {
  return active ? 'white' : '#954059';
}

function HomeIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 9.5L10 3l7 6.5" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 8.5V16a1 1 0 001 1h8a1 1 0 001-1V8.5" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CalendarIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4.5" width="14" height="12" rx="2" stroke={iconStroke(active)} strokeWidth="1.6" />
      <path d="M3 8h14M7 3v3M13 3v3" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" stroke={iconStroke(active)} strokeWidth="1.6" />
      <path d="M7 10l2 2 4-4.5" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BookIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 4.5c2-1 4.5-1 6 0v11c-1.5-1-4-1-6 0v-11z" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 4.5c-2-1-4.5-1-6 0v11c1.5-1 4-1 6 0v-11z" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function ClockIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10.5" r="7" stroke={iconStroke(active)} strokeWidth="1.6" />
      <path d="M10 6.5V10.5L13 12.5" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NoteIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M5 3.5h10v13l-3-2-3 2-4-2z" stroke={iconStroke(active)} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7.5 7.5h5M7.5 10.5h5" stroke={iconStroke(active)} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function HeartIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 16.5s-6.5-4-6.5-8.5a3.5 3.5 0 016.5-2 3.5 3.5 0 016.5 2c0 4.5-6.5 8.5-6.5 8.5z"
        stroke={iconStroke(active)}
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={active ? 'white' : 'none'}
      />
    </svg>
  );
}
function GearIcon({ active }: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="3" stroke={iconStroke(active)} strokeWidth="1.6" />
      <path
        d="M10 3.5v1.3M10 15.2v1.3M16.5 10h-1.3M4.8 10H3.5M14.6 5.4l-.9.9M6.3 13.7l-.9.9M14.6 14.6l-.9-.9M6.3 6.3l-.9-.9"
        stroke={iconStroke(active)}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const MOBILE_NAV_ITEMS = NAV_ITEMS;
