import { verses } from '../data/verses';
import type { Verse } from '../types';
import { toISODate, addDays } from './dateUtils';

const EPOCH = new Date(2026, 0, 1).getTime();
const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Deterministic index so the same calendar date always yields the same verse, with no API or stored state needed. */
function indexForDate(date: Date): number {
  const daysSinceEpoch = Math.floor((date.getTime() - EPOCH) / MS_PER_DAY);
  const n = ((daysSinceEpoch % verses.length) + verses.length) % verses.length;
  return n;
}

export function verseForDate(date: Date): Verse {
  return verses[indexForDate(date)];
}

export function verseOfTheDay(): Verse {
  return verseForDate(new Date());
}

export interface VerseHistoryEntry {
  date: string;
  verse: Verse;
}

export function recentVerseHistory(days: number = 7): VerseHistoryEntry[] {
  const today = new Date();
  const entries: VerseHistoryEntry[] = [];
  for (let i = 1; i <= days; i++) {
    const date = addDays(today, -i);
    entries.push({ date: toISODate(date), verse: verseForDate(date) });
  }
  return entries;
}
