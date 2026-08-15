import { useMemo } from 'react';
import { useAppData } from './AppDataContext';
import type { ClassItem, ClassMeeting, Task, CalendarEvent } from '../types';
import { dayOfWeek, timeToMinutes, toISODate, daysBetween } from '../utils/dateUtils';

export interface ScheduleItem {
  kind: 'class' | 'event';
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  location: string;
  color: string;
  refId: string; // classId or eventId
}

function classMeetingsToday(classes: ClassItem[], date: Date): { classItem: ClassItem; meeting: ClassMeeting }[] {
  const dow = dayOfWeek(date);
  const result: { classItem: ClassItem; meeting: ClassMeeting }[] = [];
  for (const c of classes) {
    for (const m of c.meetings) {
      if (m.day === dow) result.push({ classItem: c, meeting: m });
    }
  }
  return result;
}

export function useTodaysSchedule(referenceDate: Date = new Date()): ScheduleItem[] {
  const { data } = useAppData();
  return useMemo(() => {
    const iso = toISODate(referenceDate);
    const classItems: ScheduleItem[] = classMeetingsToday(data.classes, referenceDate).map(({ classItem, meeting }) => ({
      kind: 'class',
      id: `${classItem.id}-${meeting.day}`,
      title: classItem.name,
      startTime: meeting.startTime,
      endTime: meeting.endTime,
      location: classItem.location,
      color: classItem.color,
      refId: classItem.id,
    }));
    const eventItems: ScheduleItem[] = data.events
      .filter((e) => e.date === iso)
      .map((e) => ({
        kind: 'event',
        id: e.id,
        title: e.title,
        startTime: e.startTime,
        endTime: e.endTime,
        location: e.location,
        color: '#e6bccb',
        refId: e.id,
      }));
    return [...classItems, ...eventItems].sort((a, b) => {
      const at = a.startTime ? timeToMinutes(a.startTime) : 0;
      const bt = b.startTime ? timeToMinutes(b.startTime) : 0;
      return at - bt;
    });
  }, [data.classes, data.events, referenceDate]);
}

export interface NextClassInfo {
  classItem: ClassItem;
  meeting: ClassMeeting;
  isToday: boolean;
  daysUntil: number;
}

export function useNextClass(now: Date = new Date()): NextClassInfo | null {
  const { data } = useAppData();
  return useMemo(() => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (let offset = 0; offset < 8; offset++) {
      const checkDate = new Date(now);
      checkDate.setDate(checkDate.getDate() + offset);
      const dow = dayOfWeek(checkDate);
      const meetingsThatDay: { classItem: ClassItem; meeting: ClassMeeting }[] = [];
      for (const c of data.classes) {
        for (const m of c.meetings) {
          if (m.day === dow) meetingsThatDay.push({ classItem: c, meeting: m });
        }
      }
      meetingsThatDay.sort((a, b) => timeToMinutes(a.meeting.startTime) - timeToMinutes(b.meeting.startTime));
      for (const entry of meetingsThatDay) {
        if (offset === 0 && timeToMinutes(entry.meeting.startTime) < nowMinutes) continue;
        return { classItem: entry.classItem, meeting: entry.meeting, isToday: offset === 0, daysUntil: offset };
      }
    }
    return null;
  }, [data.classes, now]);
}

export type DeadlineGroup = 'overdue' | 'today' | 'thisWeek' | 'nextWeek' | 'later';

export function groupDeadline(task: Task, todayISO: string): DeadlineGroup {
  if (!task.dueDate) return 'later';
  const diff = daysBetween(todayISO, task.dueDate);
  if (diff < 0) return 'overdue';
  if (diff === 0) return 'today';
  if (diff <= 7) return 'thisWeek';
  if (diff <= 14) return 'nextWeek';
  return 'later';
}

export function useUpcomingDeadlinesThisWeek(): Task[] {
  const { data } = useAppData();
  return useMemo(() => {
    const todayISO = toISODate(new Date());
    return data.tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      const diff = daysBetween(todayISO, t.dueDate);
      return diff >= 0 && diff <= 7;
    });
  }, [data.tasks]);
}

export function useTasksDueToday(): Task[] {
  const { data } = useAppData();
  return useMemo(() => {
    const todayISO = toISODate(new Date());
    return data.tasks.filter((t) => t.status !== 'completed' && t.dueDate === todayISO);
  }, [data.tasks]);
}

export function useEventsForDate(iso: string): CalendarEvent[] {
  const { data } = useAppData();
  return useMemo(() => data.events.filter((e) => e.date === iso), [data.events, iso]);
}

export function useClassesForDate(date: Date) {
  const { data } = useAppData();
  return useMemo(() => classMeetingsToday(data.classes, date), [data.classes, date]);
}
