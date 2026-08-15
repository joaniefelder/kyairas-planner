import { useAppData } from '../../hooks/AppDataContext';
import { getItemsForDate } from '../../utils/calendarItems';
import type { CalendarAgendaItem } from '../../utils/calendarItems';
import { toISODate, isToday, startOfWeek, addDays } from '../../utils/dateUtils';
import { DayAgenda } from './DayAgenda';

interface WeekViewProps {
  currentDate: Date;
  onSelectItem: (item: CalendarAgendaItem) => void;
}

export function WeekView({ currentDate, onSelectItem }: WeekViewProps) {
  const { data } = useAppData();
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
      {days.map((date) => {
        const iso = toISODate(date);
        const items = getItemsForDate(data, iso);
        const today = isToday(iso);
        return (
          <div
            key={iso}
            className={`rounded-2xl border p-3 ${today ? 'border-blush-500 bg-blush-50/60 ring-1 ring-blush-300' : 'border-blush-150 bg-white/50'}`}
          >
            <p className={`text-xs font-bold uppercase tracking-wide ${today ? 'text-blush-700' : 'text-blush-500'}`}>
              {date.toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <p className="mb-2 font-serif text-lg font-semibold text-blush-900">{date.getDate()}</p>
            <DayAgenda items={items} onSelect={onSelectItem} emptyLabel="—" compact />
          </div>
        );
      })}
    </div>
  );
}
