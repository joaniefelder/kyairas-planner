import { useState } from 'react';
import { MonthView } from '../components/calendar/MonthView';
import { WeekView } from '../components/calendar/WeekView';
import { DayView } from '../components/calendar/DayView';
import { AgendaItemDetailModal } from '../components/calendar/AgendaItemDetailModal';
import type { CalendarAgendaItem } from '../utils/calendarItems';
import { EventFormModal } from '../components/EventFormModal';
import { TaskFormModal } from '../components/TaskFormModal';
import { Button } from '../components/ui/Button';
import { useAppData } from '../hooks/AppDataContext';
import { addDays } from '../utils/dateUtils';

type ViewMode = 'month' | 'week' | 'day';

export function Calendar() {
  const { data } = useAppData();
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedItem, setSelectedItem] = useState<CalendarAgendaItem | null>(null);
  const [addEventOpen, setAddEventOpen] = useState(false);
  const [editEventOpen, setEditEventOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);

  function goPrev() {
    if (viewMode === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, -7));
    else setCurrentDate((d) => addDays(d, -1));
  }
  function goNext() {
    if (viewMode === 'month') setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    else if (viewMode === 'week') setCurrentDate((d) => addDays(d, 7));
    else setCurrentDate((d) => addDays(d, 1));
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  const editingEvent = selectedItem?.kind === 'event' ? data.events.find((e) => e.id === selectedItem.refId) ?? null : null;
  const editingTask = selectedItem?.kind === 'task' ? data.tasks.find((t) => t.id === selectedItem.refId) ?? null : null;

  const headerLabel =
    viewMode === 'month'
      ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : viewMode === 'day'
        ? currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
        : `Week of ${currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-blush-900">Calendar</h1>
          <p className="mt-1 text-blush-600">Classes, events, and deadlines — all together.</p>
        </div>
        <Button onClick={() => setAddEventOpen(true)}>+ Add Event</Button>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            aria-label="Previous"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-blush-700 transition hover:bg-blush-200"
          >
            ‹
          </button>
          <button
            onClick={goToday}
            className="rounded-full bg-blush-100 px-4 py-1.5 text-sm font-semibold text-blush-700 transition hover:bg-blush-200"
          >
            Today
          </button>
          <button
            onClick={goNext}
            aria-label="Next"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-blush-700 transition hover:bg-blush-200"
          >
            ›
          </button>
          <h2 className="ml-2 font-serif text-lg font-semibold text-blush-900 sm:text-xl">{headerLabel}</h2>
        </div>

        <div className="flex gap-1 rounded-full bg-blush-100 p-1" role="tablist" aria-label="Calendar view">
          {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              role="tab"
              aria-selected={viewMode === mode}
              onClick={() => setViewMode(mode)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
                viewMode === mode ? 'bg-blush-600 text-white shadow-[var(--shadow-soft)]' : 'text-blush-600 hover:bg-blush-150'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {viewMode === 'month' && <MonthView currentDate={currentDate} onSelectItem={setSelectedItem} />}
        {viewMode === 'week' && <WeekView currentDate={currentDate} onSelectItem={setSelectedItem} />}
        {viewMode === 'day' && <DayView currentDate={currentDate} onSelectItem={setSelectedItem} />}
      </div>

      <AgendaItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEditTask={() => setEditTaskOpen(true)}
        onEditEvent={() => setEditEventOpen(true)}
      />
      <EventFormModal isOpen={addEventOpen} onClose={() => setAddEventOpen(false)} />
      <EventFormModal
        isOpen={editEventOpen}
        onClose={() => {
          setEditEventOpen(false);
          setSelectedItem(null);
        }}
        initialEvent={editingEvent}
      />
      <TaskFormModal
        isOpen={editTaskOpen}
        onClose={() => {
          setEditTaskOpen(false);
          setSelectedItem(null);
        }}
        initialTask={editingTask}
      />
    </div>
  );
}
