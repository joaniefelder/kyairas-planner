import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/AppDataContext';
import { useTodaysSchedule, useNextClass, useTasksDueToday, useUpcomingDeadlinesThisWeek } from '../hooks/useDerivedSchedule';
import { verseOfTheDay } from '../utils/verseUtils';
import { getGreeting, formatTime12h } from '../utils/dateUtils';
import { VerseCard } from '../components/VerseCard';
import { Button } from '../components/ui/Button';
import { TaskFormModal } from '../components/TaskFormModal';
import { EventFormModal } from '../components/EventFormModal';
import { CherryBlossomBranch } from '../components/Flowers';

export function Home() {
  const { data } = useAppData();
  const schedule = useTodaysSchedule();
  const nextClass = useNextClass();
  const tasksToday = useTasksDueToday();
  const upcomingWeek = useUpcomingDeadlinesThisWeek();
  const verse = verseOfTheDay();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  const greeting = getGreeting();
  const name = data.settings.displayName || 'Kyaira Jordan';

  return (
    <div className="relative">
      <CherryBlossomBranch className="pointer-events-none absolute -right-6 -top-10 h-32 w-56 opacity-70 sm:h-40 sm:w-72" />

      <header className="relative">
        <h1 className="font-serif text-3xl font-semibold text-blush-900 sm:text-4xl">
          {greeting}, {name} <span aria-hidden>♡</span>
        </h1>
        <p className="mt-1.5 text-blush-600">Here's what's happening today.</p>
      </header>

      <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Today" accent>
          <p className="font-serif text-4xl font-bold text-blush-800">{tasksToday.length}</p>
          <p className="text-sm text-blush-500">{tasksToday.length === 1 ? 'task due' : 'tasks due'}</p>
        </SummaryCard>

        <SummaryCard label="Next Class">
          {nextClass ? (
            <>
              <p className="font-serif text-lg font-semibold text-blush-800 leading-snug">{nextClass.classItem.name}</p>
              <p className="mt-1 text-sm text-blush-500">
                {nextClass.isToday ? 'Today' : `In ${nextClass.daysUntil} day${nextClass.daysUntil > 1 ? 's' : ''}`} ·{' '}
                {formatTime12h(nextClass.meeting.startTime)}
              </p>
              {nextClass.classItem.location && <p className="text-sm text-blush-500">{nextClass.classItem.location}</p>}
            </>
          ) : (
            <p className="text-sm text-blush-500">No upcoming classes scheduled</p>
          )}
        </SummaryCard>

        <SummaryCard label="Upcoming">
          <p className="font-serif text-4xl font-bold text-blush-800">{upcomingWeek.length}</p>
          <p className="text-sm text-blush-500">deadlines this week</p>
        </SummaryCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-blush-150 bg-white/60 p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-semibold text-blush-900">Today's Schedule</h2>
              <Link to="/calendar" className="text-sm font-semibold text-blush-600 hover:text-blush-800">
                View calendar →
              </Link>
            </div>
            {schedule.length === 0 ? (
              <p className="mt-5 text-sm text-blush-500">No classes or events today. Enjoy the free time ♡</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {schedule.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 rounded-2xl bg-blush-50/60 p-3.5">
                    <span className="h-full w-1.5 self-stretch rounded-full" style={{ backgroundColor: item.color, minHeight: '2.5rem' }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-blush-900">{item.title}</p>
                      <p className="text-xs text-blush-500">
                        {item.startTime ? formatTime12h(item.startTime) : ''}
                        {item.endTime ? ` – ${formatTime12h(item.endTime)}` : ''}
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-6 rounded-3xl border border-blush-150 bg-white/60 p-6 shadow-[var(--shadow-soft)]">
            <h2 className="font-serif text-xl font-semibold text-blush-900">Quick Add</h2>
            <p className="mt-1 text-sm text-blush-500">Add something without digging through pages.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => setTaskModalOpen(true)}>+ Add Task</Button>
              <Button variant="secondary" onClick={() => setEventModalOpen(true)}>
                + Add Event
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <VerseCard verse={verse} />
        </div>
      </section>

      <TaskFormModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <EventFormModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} />
    </div>
  );
}

function SummaryCard({ label, children, accent = false }: { label: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div
      className={`rounded-3xl border p-5 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-0.5 ${
        accent ? 'border-blush-300 bg-blush-100/70' : 'border-blush-150 bg-white/60'
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-widest text-blush-500">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
