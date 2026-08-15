import { useMemo } from 'react';
import { useAppData } from '../hooks/AppDataContext';
import { DAYS_OF_WEEK } from '../types';
import { timeToMinutes } from '../utils/dateUtils';

const PPM = 1.1; // pixels per minute
const DAY_LABELS_FULL: Record<(typeof DAYS_OF_WEEK)[number], string> = {
  Sun: 'Sunday',
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
};

function hourLabel(minutes: number): string {
  let h = Math.floor(minutes / 60);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h} ${suffix}`;
}

export function WeeklySchedule() {
  const { data } = useAppData();

  const { minMinutes, maxMinutes, hours } = useMemo(() => {
    let min = 8 * 60;
    let max = 18 * 60;
    for (const c of data.classes) {
      for (const m of c.meetings) {
        min = Math.min(min, timeToMinutes(m.startTime));
        max = Math.max(max, timeToMinutes(m.endTime));
      }
    }
    min = Math.floor(min / 60) * 60;
    max = Math.ceil(max / 60) * 60;
    const hourList: number[] = [];
    for (let t = min; t <= max; t += 60) hourList.push(t);
    return { minMinutes: min, maxMinutes: max, hours: hourList };
  }, [data.classes]);

  const totalHeight = (maxMinutes - minMinutes) * PPM;

  return (
    <div className="overflow-x-auto rounded-3xl border border-blush-150 bg-white/60 p-4 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)] gap-x-1">
        <div />
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="pb-2 text-center">
            <p className="font-serif text-sm font-semibold text-blush-800">{DAY_LABELS_FULL[day]}</p>
          </div>
        ))}

        <div className="relative" style={{ height: totalHeight }}>
          {hours.map((h) => (
            <div key={h} className="absolute -translate-y-2 text-right text-[10px] font-medium text-blush-400" style={{ top: (h - minMinutes) * PPM, right: 8 }}>
              {hourLabel(h)}
            </div>
          ))}
        </div>

        {DAYS_OF_WEEK.map((day) => {
          const meetings = data.classes.flatMap((c) => c.meetings.filter((m) => m.day === day).map((m) => ({ classItem: c, meeting: m })));
          return (
            <div key={day} className="relative border-l border-blush-100" style={{ height: totalHeight }}>
              {hours.map((h) => (
                <div key={h} className="absolute inset-x-0 border-t border-blush-100" style={{ top: (h - minMinutes) * PPM }} />
              ))}
              {meetings.map(({ classItem, meeting }, idx) => {
                const top = (timeToMinutes(meeting.startTime) - minMinutes) * PPM;
                const height = Math.max((timeToMinutes(meeting.endTime) - timeToMinutes(meeting.startTime)) * PPM, 28);
                return (
                  <div
                    key={`${classItem.id}-${idx}`}
                    className="absolute left-0.5 right-0.5 overflow-hidden rounded-lg px-1.5 py-1 text-white shadow-sm"
                    style={{ top, height, backgroundColor: classItem.color }}
                    title={`${classItem.name} · ${meeting.startTime}–${meeting.endTime}`}
                  >
                    <p className="truncate text-[10px] font-bold leading-tight sm:text-[11px]">{classItem.name}</p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
