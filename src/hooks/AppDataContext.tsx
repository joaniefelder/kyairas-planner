import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { v4 as uuid } from 'uuid';
import * as storage from '../storage';
import type { AppData, ClassItem, Task, CalendarEvent, Note, AppSettings, FavoriteVerse } from '../types';

interface AppDataContextValue {
  data: AppData;
  // classes
  addClass: (input: Omit<ClassItem, 'id' | 'createdAt'>) => ClassItem;
  updateClass: (id: string, updates: Partial<Omit<ClassItem, 'id'>>) => void;
  deleteClass: (id: string) => void;
  // tasks
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'>) => Task;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id'>>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  // events
  addEvent: (input: Omit<CalendarEvent, 'id' | 'createdAt'>) => CalendarEvent;
  updateEvent: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  deleteEvent: (id: string) => void;
  // notes
  addNote: (input: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
  // settings
  updateSettings: (updates: Partial<AppSettings>) => void;
  // verse favorites
  toggleFavoriteVerse: (reference: string) => void;
  isVerseFavorited: (reference: string) => boolean;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => storage.loadAll());

  const addClass = useCallback((input: Omit<ClassItem, 'id' | 'createdAt'>) => {
    const newClass: ClassItem = { ...input, id: uuid(), createdAt: new Date().toISOString() };
    setData((prev) => {
      const classes = [...prev.classes, newClass];
      storage.saveClasses(classes);
      return { ...prev, classes };
    });
    return newClass;
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<Omit<ClassItem, 'id'>>) => {
    setData((prev) => {
      const classes = prev.classes.map((c) => (c.id === id ? { ...c, ...updates } : c));
      storage.saveClasses(classes);
      return { ...prev, classes };
    });
  }, []);

  const deleteClass = useCallback((id: string) => {
    setData((prev) => {
      const classes = prev.classes.filter((c) => c.id !== id);
      const tasks = prev.tasks.map((t) => (t.classId === id ? { ...t, classId: null } : t));
      const notes = prev.notes.map((n) => (n.classId === id ? { ...n, classId: null } : n));
      storage.saveClasses(classes);
      storage.saveTasks(tasks);
      storage.saveNotes(notes);
      return { ...prev, classes, tasks, notes };
    });
  }, []);

  const addTask = useCallback((input: Omit<Task, 'id' | 'createdAt' | 'status' | 'completedAt'>) => {
    const newTask: Task = {
      ...input,
      id: uuid(),
      status: 'pending',
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => {
      const tasks = [...prev.tasks, newTask];
      storage.saveTasks(tasks);
      return { ...prev, tasks };
    });
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id'>>) => {
    setData((prev) => {
      const tasks = prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
      storage.saveTasks(tasks);
      return { ...prev, tasks };
    });
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setData((prev) => {
      const tasks = prev.tasks.map((t) => {
        if (t.id !== id) return t;
        const completed = t.status !== 'completed';
        return {
          ...t,
          status: completed ? ('completed' as const) : ('pending' as const),
          completedAt: completed ? new Date().toISOString() : null,
        };
      });
      storage.saveTasks(tasks);
      return { ...prev, tasks };
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => {
      const tasks = prev.tasks.filter((t) => t.id !== id);
      storage.saveTasks(tasks);
      return { ...prev, tasks };
    });
  }, []);

  const addEvent = useCallback((input: Omit<CalendarEvent, 'id' | 'createdAt'>) => {
    const newEvent: CalendarEvent = { ...input, id: uuid(), createdAt: new Date().toISOString() };
    setData((prev) => {
      const events = [...prev.events, newEvent];
      storage.saveEvents(events);
      return { ...prev, events };
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
    setData((prev) => {
      const events = prev.events.map((e) => (e.id === id ? { ...e, ...updates } : e));
      storage.saveEvents(events);
      return { ...prev, events };
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setData((prev) => {
      const events = prev.events.filter((e) => e.id !== id);
      storage.saveEvents(events);
      return { ...prev, events };
    });
  }, []);

  const addNote = useCallback((input: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote: Note = { ...input, id: uuid(), createdAt: now, updatedAt: now };
    setData((prev) => {
      const notes = [...prev.notes, newNote];
      storage.saveNotes(notes);
      return { ...prev, notes };
    });
    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => {
    setData((prev) => {
      const notes = prev.notes.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n));
      storage.saveNotes(notes);
      return { ...prev, notes };
    });
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData((prev) => {
      const notes = prev.notes.filter((n) => n.id !== id);
      storage.saveNotes(notes);
      return { ...prev, notes };
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setData((prev) => {
      const settings = { ...prev.settings, ...updates };
      storage.saveSettings(settings);
      return { ...prev, settings };
    });
  }, []);

  const toggleFavoriteVerse = useCallback((reference: string) => {
    setData((prev) => {
      const exists = prev.favoriteVerses.some((f) => f.reference === reference);
      const favoriteVerses: FavoriteVerse[] = exists
        ? prev.favoriteVerses.filter((f) => f.reference !== reference)
        : [...prev.favoriteVerses, { reference, favoritedAt: new Date().toISOString() }];
      storage.saveFavoriteVerses(favoriteVerses);
      return { ...prev, favoriteVerses };
    });
  }, []);

  const isVerseFavorited = useCallback(
    (reference: string) => data.favoriteVerses.some((f) => f.reference === reference),
    [data.favoriteVerses]
  );

  const value = useMemo<AppDataContextValue>(
    () => ({
      data,
      addClass,
      updateClass,
      deleteClass,
      addTask,
      updateTask,
      toggleTaskComplete,
      deleteTask,
      addEvent,
      updateEvent,
      deleteEvent,
      addNote,
      updateNote,
      deleteNote,
      updateSettings,
      toggleFavoriteVerse,
      isVerseFavorited,
    }),
    [
      data,
      addClass,
      updateClass,
      deleteClass,
      addTask,
      updateTask,
      toggleTaskComplete,
      deleteTask,
      addEvent,
      updateEvent,
      deleteEvent,
      addNote,
      updateNote,
      deleteNote,
      updateSettings,
      toggleFavoriteVerse,
      isVerseFavorited,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}
