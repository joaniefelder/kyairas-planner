import type { AppData } from '../types';
import { dayOfWeek, fromISODate, timeToMinutes } from './dateUtils';

export interface CalendarAgendaItem {
  kind: 'class' | 'event' | 'task';
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  location: string;
  color: string;
  refId: string;
  completed?: boolean;
}

export function getItemsForDate(data: AppData, iso: string): CalendarAgendaItem[] {
  const date = fromISODate(iso);
  const dow = dayOfWeek(date);

  const classItems: CalendarAgendaItem[] = data.classes.flatMap((c) =>
    c.meetings
      .filter((m) => m.day === dow)
      .map((m) => ({
        kind: 'class' as const,
        id: `${c.id}-${m.day}`,
        title: c.name,
        startTime: m.startTime,
        endTime: m.endTime,
        location: c.location,
        color: c.color,
        refId: c.id,
      }))
  );

  const eventItems: CalendarAgendaItem[] = data.events
    .filter((e) => e.date === iso)
    .map((e) => ({
      kind: 'event' as const,
      id: e.id,
      title: e.title,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      color: '#e6bccb',
      refId: e.id,
    }));

  const taskItems: CalendarAgendaItem[] = data.tasks
    .filter((t) => t.dueDate === iso)
    .map((t) => {
      const classItem = t.classId ? data.classes.find((c) => c.id === t.classId) : null;
      return {
        kind: 'task' as const,
        id: t.id,
        title: t.title,
        startTime: t.dueTime,
        endTime: null,
        location: '',
        color: classItem?.color ?? '#b3546f',
        refId: t.id,
        completed: t.status === 'completed',
      };
    });

  return [...classItems, ...eventItems, ...taskItems].sort((a, b) => {
    const at = a.startTime ? timeToMinutes(a.startTime) : 24 * 60;
    const bt = b.startTime ? timeToMinutes(b.startTime) : 24 * 60;
    return at - bt;
  });
}
