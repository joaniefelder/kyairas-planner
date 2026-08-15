import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../hooks/AppDataContext';
import { TextField, TextAreaField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { DAYS_OF_WEEK } from '../types';
import type { DayOfWeek } from '../types';

const ACCENT_SHADES = ['#cc6f88', '#b3546f', '#dd8fa2', '#954059', '#e8a3b8', '#c96f95', '#e0218a'];

export function Settings() {
  const { data, updateSettings, updateClass } = useAppData();
  const [displayName, setDisplayName] = useState(data.settings.displayName);
  const [motivationalMessage, setMotivationalMessage] = useState(data.settings.motivationalMessage);
  const [saved, setSaved] = useState(false);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    updateSettings({ displayName: displayName.trim(), motivationalMessage: motivationalMessage.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <header>
        <h1 className="font-serif text-3xl font-semibold text-blush-900">Settings</h1>
        <p className="mt-1 text-blush-600">Make it feel like yours.</p>
      </header>

      <form onSubmit={handleSaveProfile} className="mt-7 space-y-4 rounded-3xl border border-blush-150 bg-white/60 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-serif text-lg font-semibold text-blush-900">Profile</h2>
        <TextField id="settings-name" label="Displayed name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <TextAreaField
          id="settings-message"
          label="Motivational message (optional)"
          rows={2}
          value={motivationalMessage}
          onChange={(e) => setMotivationalMessage(e.target.value)}
        />
        <div className="flex items-center gap-3">
          <Button type="submit">Save</Button>
          {saved && <span className="text-sm font-semibold text-blush-600">Saved ✓</span>}
        </div>
      </form>

      <section className="mt-6 rounded-3xl border border-blush-150 bg-white/60 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-serif text-lg font-semibold text-blush-900">Accent Shade</h2>
        <p className="mt-1 text-sm text-blush-500">Pick the pink that shows up on buttons and highlights.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {ACCENT_SHADES.map((color) => (
            <button
              key={color}
              onClick={() => updateSettings({ accentShade: color })}
              aria-label={`Use accent color ${color}`}
              aria-pressed={data.settings.accentShade === color}
              className={`h-10 w-10 rounded-full border-2 transition ${
                data.settings.accentShade === color ? 'border-blush-900 scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-blush-150 bg-white/60 p-6 shadow-[var(--shadow-soft)]">
        <h2 className="font-serif text-lg font-semibold text-blush-900">Class Information</h2>
        <p className="mt-1 text-sm text-blush-500">Update professor, location, and meeting times per class.</p>
        <div className="mt-4 space-y-5">
          {data.classes.map((c) => (
            <div key={c.id} className="rounded-2xl border border-blush-150 p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                <p className="font-semibold text-blush-900">{c.name}</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  id={`prof-${c.id}`}
                  label="Professor"
                  value={c.professor}
                  onChange={(e) => updateClass(c.id, { professor: e.target.value })}
                  placeholder="Not set"
                />
                <TextField
                  id={`loc-${c.id}`}
                  label="Location"
                  value={c.location}
                  onChange={(e) => updateClass(c.id, { location: e.target.value })}
                  placeholder="Not set"
                />
              </div>
              <div className="mt-3 space-y-2">
                {c.meetings.map((m, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2">
                    <select
                      aria-label={`Day for meeting ${idx + 1} of ${c.name}`}
                      value={m.day}
                      onChange={(e) => {
                        const meetings = [...c.meetings];
                        meetings[idx] = { ...m, day: e.target.value as DayOfWeek };
                        updateClass(c.id, { meetings });
                      }}
                      className="rounded-xl border border-blush-200 bg-white/70 px-3 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label={`Start time for meeting ${idx + 1} of ${c.name}`}
                      type="time"
                      value={m.startTime}
                      onChange={(e) => {
                        const meetings = [...c.meetings];
                        meetings[idx] = { ...m, startTime: e.target.value };
                        updateClass(c.id, { meetings });
                      }}
                      className="rounded-xl border border-blush-200 bg-white/70 px-3 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                    />
                    <input
                      aria-label={`End time for meeting ${idx + 1} of ${c.name}`}
                      type="time"
                      value={m.endTime}
                      onChange={(e) => {
                        const meetings = [...c.meetings];
                        meetings[idx] = { ...m, endTime: e.target.value };
                        updateClass(c.id, { meetings });
                      }}
                      className="rounded-xl border border-blush-200 bg-white/70 px-3 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-6 text-center text-xs text-blush-400">
        Full class editing (adding classes, links, and resources) lives on the{' '}
        <Link to="/classes" className="font-semibold text-blush-600 underline">
          Classes
        </Link>{' '}
        page.
      </p>
    </div>
  );
}
