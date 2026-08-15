export type Priority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'pending' | 'completed';

export type DayOfWeek = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface ClassMeeting {
  day: DayOfWeek;
  startTime: string; // "HH:MM" 24hr
  endTime: string; // "HH:MM" 24hr
}

export interface ClassLink {
  id: string;
  label: string;
  url: string;
}

export interface ClassItem {
  id: string;
  name: string;
  professor: string;
  location: string;
  color: string; // hex value, one of the pink shade tokens
  meetings: ClassMeeting[];
  links: ClassLink[];
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  classId: string | null;
  dueDate: string | null; // ISO date "YYYY-MM-DD"
  dueTime: string | null; // "HH:MM"
  priority: Priority;
  status: TaskStatus;
  notes: string;
  createdAt: string;
  completedAt: string | null;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date "YYYY-MM-DD"
  startTime: string | null;
  endTime: string | null;
  location: string;
  notes: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  classId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  displayName: string;
  accentShade: string; // hex value for accent
  motivationalMessage: string;
}

export interface FavoriteVerse {
  reference: string;
  favoritedAt: string;
}

export interface AppData {
  classes: ClassItem[];
  tasks: Task[];
  events: CalendarEvent[];
  notes: Note[];
  settings: AppSettings;
  favoriteVerses: FavoriteVerse[];
}

export interface Verse {
  reference: string;
  text: string;
  themes: string[];
}
