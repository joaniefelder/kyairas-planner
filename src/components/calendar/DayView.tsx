import { useAppData } from '../../hooks/AppDataContext';
import { getItemsForDate } from '../../utils/calendarItems';
import type { CalendarAgendaItem } from '../../utils/calendarItems';
import { toISODate, formatTime12h } from '../../utils/dateUtils';

interface DayViewProps {
  currentDate: Date;
  onSelectItem: (item: CalendarAgendaItem) => void;
}

export function DayView({ currentDate, onSelectItem }: DayViewProps) {
  const { data } = useAppData();
  const iso = toISODate(currentDate);
  const items = getItemsForDate(data, iso);

  return (
    <div className="rounded-3xl border border-blush-150 bg-white/60 p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <h3 className="font-serif text-xl font-semibold text-blush-900">
        {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </h3>
      {items.length === 0 ? (
        <p className="mt-6 text-sm text-blush-500">Nothing on the books today ♡</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <button
                onClick={() => onSelectItem(item)}
                className="flex w-full items-center gap-3 rounded-2xl p-3.5 text-left transition hover:brightness-95"
                style={{ backgroundColor: `${item.color}22` }}
              >
                <span className="h-full min-h-[2.25rem] w-1.5 shrink-0 self-stretch rounded-full" style={{ backgroundColor: item.color }} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-semibold text-blush-900 ${item.completed ? 'line-through opacity-60' : ''}`}>{item.title}</p>
                  <p className="text-xs text-blush-500">
                    {item.startTime ? formatTime12h(item.startTime) : 'All day'}
                    {item.endTime ? ` – ${formatTime12h(item.endTime)}` : ''}
                    {item.location ? ` · ${item.location}` : ''}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blush-600">
                  {item.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
