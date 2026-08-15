/**
 * Thin key/value driver over window.localStorage.
 * This is the ONLY file that should touch `localStorage` directly.
 * Swapping persistence backends later (e.g. Supabase) means writing a
 * new driver with this same `get`/`set` shape and pointing storage/index.ts
 * at it — nothing above this layer needs to change.
 */
export interface StorageDriver {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

export const localStorageDriver: StorageDriver = {
  get<T>(key: string): T | null {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable — fail silently, data stays in memory for the session
    }
  },
  remove(key: string): void {
    window.localStorage.removeItem(key);
  },
};
