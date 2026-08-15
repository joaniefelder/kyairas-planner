import { localStorageDriver } from './localStorageDriver';
import { defaultClasses } from '../data/defaultClasses';
import type { AppData, ClassItem, Task, CalendarEvent, Note, AppSettings, FavoriteVerse } from '../types';

/**
 * Centralized data-access layer. Every read/write in the app goes through
 * these functions instead of touching localStorage directly, so migrating
 * to a real backend (e.g. Supabase) later only means rewriting the bodies
 * of these functions — callers never change.
 */

const KEYS = {
  classes: 'kp:classes',
  tasks: 'kp:tasks',
  events: 'kp:events',
  notes: 'kp:notes',
  settings: 'kp:settings',
  favoriteVerses: 'kp:favoriteVerses',
} as const;

const defaultSettings: AppSettings = {
  displayName: 'Kyaira Jordan',
  accentShade: '#cc6f88',
  motivationalMessage: 'You are exactly where you need to be. Keep going.',
};

function readOrSeed<T>(key: string, seed: T): T {
  const existing = localStorageDriver.get<T>(key);
  if (existing !== null) return existing;
  localStorageDriver.set(key, seed);
  return seed;
}

export function loadAll(): AppData {
  return {
    classes: readOrSeed<ClassItem[]>(KEYS.classes, defaultClasses),
    tasks: readOrSeed<Task[]>(KEYS.tasks, []),
    events: readOrSeed<CalendarEvent[]>(KEYS.events, []),
    notes: readOrSeed<Note[]>(KEYS.notes, []),
    settings: readOrSeed<AppSettings>(KEYS.settings, defaultSettings),
    favoriteVerses: readOrSeed<FavoriteVerse[]>(KEYS.favoriteVerses, []),
  };
}

export function saveClasses(classes: ClassItem[]): void {
  localStorageDriver.set(KEYS.classes, classes);
}

export function saveTasks(tasks: Task[]): void {
  localStorageDriver.set(KEYS.tasks, tasks);
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorageDriver.set(KEYS.events, events);
}

export function saveNotes(notes: Note[]): void {
  localStorageDriver.set(KEYS.notes, notes);
}

export function saveSettings(settings: AppSettings): void {
  localStorageDriver.set(KEYS.settings, settings);
}

export function saveFavoriteVerses(favorites: FavoriteVerse[]): void {
  localStorageDriver.set(KEYS.favoriteVerses, favorites);
}
