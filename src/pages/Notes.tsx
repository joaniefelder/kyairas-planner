import { useMemo, useState } from 'react';
import { useAppData } from '../hooks/AppDataContext';
import { NoteFormModal } from '../components/NoteFormModal';
import { Button } from '../components/ui/Button';
import type { Note } from '../types';

export function Notes() {
  const { data, deleteNote } = useAppData();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...data.notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (!q) return sorted;
    return sorted.filter((n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q));
  }, [data.notes, search]);

  function openEdit(note: Note) {
    setEditingNote(note);
    setModalOpen(true);
  }
  function openAdd() {
    setEditingNote(null);
    setModalOpen(true);
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-blush-900">Notes</h1>
          <p className="mt-1 text-blush-600">Everything you've jotted down, tucked in one spot.</p>
        </div>
        <Button onClick={openAdd}>+ New Note</Button>
      </header>

      <div className="mt-6">
        <label htmlFor="notes-search" className="sr-only">
          Search notes
        </label>
        <div className="relative max-w-sm">
          <svg className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="#cc6f88" strokeWidth="1.5" />
            <path d="M11 11l3.5 3.5" stroke="#cc6f88" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            id="notes-search"
            type="search"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-blush-200 bg-white/70 py-2.5 pl-10 pr-4 text-sm text-blush-900 placeholder:text-blush-400 focus:border-blush-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blush-200"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-blush-200 p-8 text-center text-sm text-blush-500">
          {search ? 'No notes match your search.' : 'No notes yet. Start one whenever inspiration hits.'}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note, i) => {
            const classItem = note.classId ? data.classes.find((c) => c.id === note.classId) : null;
            const rotation = i % 3 === 0 ? '-rotate-1' : i % 3 === 1 ? 'rotate-0' : 'rotate-1';
            return (
              <div
                key={note.id}
                className={`group relative flex flex-col rounded-2xl border border-blush-150 bg-gradient-to-br from-blush-50 to-cream p-5 shadow-[var(--shadow-soft)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] ${rotation}`}
              >
                {classItem && (
                  <span
                    className="mb-2 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: classItem.color }}
                  >
                    {classItem.name}
                  </span>
                )}
                <h3 className="font-serif text-lg font-semibold text-blush-900">{note.title}</h3>
                <p className="mt-2 flex-1 whitespace-pre-wrap text-sm text-blush-700 line-clamp-6">{note.body}</p>
                <div className="mt-4 flex items-center justify-between border-t border-blush-150/70 pt-3">
                  <span className="text-xs text-blush-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => openEdit(note)}
                      className="rounded-full px-2.5 py-1 text-xs font-semibold text-blush-600 hover:bg-blush-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="rounded-full px-2.5 py-1 text-xs font-semibold text-blush-600 hover:bg-blush-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <NoteFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialNote={editingNote} />
    </div>
  );
}
