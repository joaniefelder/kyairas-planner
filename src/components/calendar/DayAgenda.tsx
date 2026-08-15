import type { CalendarAgendaItem } from '../../utils/calendarItems';
import { formatTime12h } from '../../utils/dateUtils';

interface DayAgendaProps {
  items: CalendarAgendaItem[];
  onSelect: (item: CalendarAgendaItem) => void;
  emptyLabel?: string;
  compact?: boolean;
}

export function DayAgenda({ items, onSelect, emptyLabel = 'Nothing scheduled.', compact = false }: DayAgendaProps) {
  if (items.length === 0) {
    return <p className={`text-blush-400 ${compact ? 'text-xs' : 'text-sm'}`}>{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item) =>
        compact ? (
          <li key={`${item.kind}-${item.id}`}>
            <button
              onClick={() => onSelect(item)}
              className="block w-full rounded-xl px-2.5 py-1.5 text-left text-[11px] transition hover:brightness-95"
              style={{ backgroundColor: `${item.color}26` }}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`min-w-0 flex-1 truncate font-semibold text-blush-900 ${item.completed ? 'line-through opacity-60' : ''}`}>
                  {item.title}
                </span>
              </span>
              {item.startTime && <span className="mt-0.5 block pl-3 text-blush-500">{formatTime12h(item.startTime)}</span>}
            </button>
          </li>
        ) : (
          <li key={`${item.kind}-${item.id}`}>
            <button
              onClick={() => onSelect(item)}
              className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition hover:brightness-95"
              style={{ backgroundColor: `${item.color}26` }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={`min-w-0 flex-1 truncate font-semibold text-blush-900 ${item.completed ? 'line-through opacity-60' : ''}`}>
                {item.title}
              </span>
              {item.startTime && <span className="shrink-0 text-blush-500">{formatTime12h(item.startTime)}</span>}
            </button>
          </li>
        )
      )}
    </ul>
  );
}
