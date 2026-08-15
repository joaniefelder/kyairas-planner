import { useMemo, useState } from 'react';
import { useAppData } from '../../hooks/AppDataContext';
import { getItemsForDate } from '../../utils/calendarItems';
import type { CalendarAgendaItem } from '../../utils/calendarItems';
import { toISODate, isToday, daysInMonth, formatDateFriendly } from '../../utils/dateUtils';
import { Modal } from '../ui/Modal';
import { DayAgenda } from './DayAgenda';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MAX_VISIBLE = 3;

interface MonthViewProps {
  currentDate: Date;
  onSelectItem: (item: CalendarAgendaItem) => void;
}

export function MonthView({ currentDate, onSelectItem }: MonthViewProps) {
  const { data } = useAppData();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const cells = useMemo(() => {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const totalDays = daysInMonth(year, month);
    const prevMonthDays = daysInMonth(year, month - 1);

    const list: { date: Date; inMonth: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      list.push({ date: new Date(year, month - 1, prevMonthDays - i), inMonth: false });
    }
    for (let d = 1; d <= totalDays; d++) {
      list.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (list.length % 7 !== 0 || list.length < 42) {
      const last = list[list.length - 1].date;
      list.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return list;
  }, [year, month]);

  const expandedItems = expandedDay ? getItemsForDate(data, expandedDay) : [];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold uppercase tracking-wide text-blush-500 sm:gap-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1.5 sm:gap-2">
        {cells.map(({ date, inMonth }) => {
          const iso = toISODate(date);
          const items = getItemsForDate(data, iso);
          const visible = items.slice(0, MAX_VISIBLE);
          const overflow = items.length - visible.length;
          const today = isToday(iso);
          return (
            <div
              key={iso}
              className={`min-h-[90px] rounded-2xl border p-1.5 transition sm:min-h-[110px] sm:p-2 ${
                inMonth ? 'border-blush-150 bg-white/50' : 'border-blush-100/60 bg-blush-50/30'
              } ${today ? 'ring-2 ring-blush-500' : ''}`}
            >
              <p className={`text-xs font-semibold ${inMonth ? 'text-blush-800' : 'text-blush-300'} ${today ? 'text-blush-700' : ''}`}>
                {date.getDate()}
              </p>
              <div className="mt-1 space-y-1">
                {visible.map((item) => (
                  <button
                    key={`${item.kind}-${item.id}`}
                    onClick={() => onSelectItem(item)}
                    className={`block w-full truncate rounded-md px-1.5 py-0.5 text-left text-[9.5px] font-semibold text-white sm:text-[10px] ${
                      item.completed ? 'opacity-50 line-through' : ''
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.title}
                  >
                    {item.title}
                  </button>
                ))}
                {overflow > 0 && (
                  <button
                    onClick={() => setExpandedDay(iso)}
                    className="block w-full truncate rounded-md px-1.5 py-0.5 text-left text-[9.5px] font-semibold text-blush-500 hover:text-blush-700 sm:text-[10px]"
                  >
                    +{overflow} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={!!expandedDay} onClose={() => setExpandedDay(null)} title={expandedDay ? formatDateFriendly(expandedDay) : ''}>
        <DayAgenda
          items={expandedItems}
          onSelect={(item) => {
            setExpandedDay(null);
            onSelectItem(item);
          }}
        />
      </Modal>
    </div>
  );
}
