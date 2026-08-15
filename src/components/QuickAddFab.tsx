import { useState } from 'react';
import { TaskFormModal } from './TaskFormModal';
import { EventFormModal } from './EventFormModal';
import { useAppData } from '../hooks/AppDataContext';

export function QuickAddFab() {
  const { data } = useAppData();
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-2 lg:bottom-8 lg:right-8">
        {menuOpen && (
          <div className="mb-1 flex flex-col items-end gap-2 animate-fade-in-up">
            <button
              onClick={() => {
                setEventOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blush-800 shadow-[var(--shadow-soft)] transition hover:bg-blush-50"
            >
              Add Event
            </button>
            <button
              onClick={() => {
                setTaskOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-blush-800 shadow-[var(--shadow-soft)] transition hover:bg-blush-50"
            >
              Add Task
            </button>
          </div>
        )}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label="Quick add"
          style={{ backgroundColor: data.settings.accentShade }}
          className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[var(--shadow-lift)] transition-all duration-200 hover:brightness-95 active:scale-95 ${
            menuOpen ? 'rotate-45' : ''
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 4v16M4 12h16" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <TaskFormModal isOpen={taskOpen} onClose={() => setTaskOpen(false)} />
      <EventFormModal isOpen={eventOpen} onClose={() => setEventOpen(false)} />
    </>
  );
}
