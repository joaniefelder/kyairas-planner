import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/AppDataContext';
import { WeeklySchedule } from '../components/WeeklySchedule';
import { ClassFormModal } from '../components/ClassFormModal';
import { Button } from '../components/ui/Button';

function formatMeetingSummary(meetings: { day: string; startTime: string; endTime: string }[]): string {
  if (meetings.length === 0) return 'No meetings scheduled';
  const days = meetings.map((m) => m.day).join('/');
  const first = meetings[0];
  return `${days} · ${formatTime(first.startTime)}–${formatTime(first.endTime)}`;
}

function formatTime(time: string): string {
  const [hStr, m] = time.split(':');
  let h = Number(hStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

export function Classes() {
  const { data } = useAppData();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-blush-900">Classes</h1>
          <p className="mt-1 text-blush-600">Your Fall lineup, all in one place.</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Class</Button>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.classes.map((c) => {
          const assignmentCount = data.tasks.filter((t) => t.classId === c.id && t.status !== 'completed').length;
          return (
            <Link
              key={c.id}
              to={`/classes/${c.id}`}
              className="group block overflow-hidden rounded-3xl border border-blush-150 bg-white/60 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]"
            >
              <div className="h-2.5" style={{ backgroundColor: c.color }} />
              <div className="p-5">
                <h2 className="font-serif text-lg font-semibold leading-snug text-blush-900">{c.name}</h2>
                <p className="mt-1.5 text-sm text-blush-500">{formatMeetingSummary(c.meetings)}</p>
                {c.location && <p className="text-sm text-blush-500">{c.location}</p>}
                {c.professor && <p className="text-sm text-blush-500">Prof. {c.professor}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs font-bold text-blush-700">
                    {assignmentCount} open assignment{assignmentCount === 1 ? '' : 's'}
                  </span>
                  <span className="text-sm font-semibold text-blush-600 group-hover:text-blush-800">View →</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-blush-900">Weekly Schedule</h2>
        <div className="mt-4">
          <WeeklySchedule />
        </div>
      </section>

      <ClassFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
