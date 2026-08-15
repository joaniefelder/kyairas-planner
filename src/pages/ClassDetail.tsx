import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { useAppData } from '../hooks/AppDataContext';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { NoteFormModal } from '../components/NoteFormModal';
import { ClassFormModal } from '../components/ClassFormModal';
import { Button } from '../components/ui/Button';
import { TextField } from '../components/ui/FormField';
import type { Task, Note } from '../types';

function formatTime(time: string): string {
  const [hStr, m] = time.split(':');
  let h = Number(hStr);
  const suffix = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${suffix}`;
}

export function ClassDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, updateClass, deleteClass } = useAppData();
  const classItem = data.classes.find((c) => c.id === id);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editClassOpen, setEditClassOpen] = useState(false);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  if (!classItem) {
    return (
      <div className="text-center">
        <p className="text-blush-600">This class doesn't exist anymore.</p>
        <Link to="/classes" className="mt-2 inline-block font-semibold text-blush-700 underline">
          Back to Classes
        </Link>
      </div>
    );
  }

  const tasks = data.tasks.filter((t) => t.classId === classItem.id);
  const openTasks = tasks.filter((t) => t.status !== 'completed').sort((a, b) => (a.dueDate ?? '9999').localeCompare(b.dueDate ?? '9999'));
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const notes = data.notes.filter((n) => n.classId === classItem.id).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  function handleAddLink(e: React.FormEvent) {
    e.preventDefault();
    if (!linkLabel.trim() || !linkUrl.trim()) return;
    updateClass(classItem!.id, { links: [...classItem!.links, { id: uuid(), label: linkLabel.trim(), url: linkUrl.trim() }] });
    setLinkLabel('');
    setLinkUrl('');
  }

  function removeLink(linkId: string) {
    updateClass(classItem!.id, { links: classItem!.links.filter((l) => l.id !== linkId) });
  }

  function handleDeleteClass() {
    if (confirm(`Delete ${classItem!.name}? Assignments and notes will be kept but unlinked.`)) {
      deleteClass(classItem!.id);
      navigate('/classes');
    }
  }

  return (
    <div>
      <Link to="/classes" className="text-sm font-semibold text-blush-500 hover:text-blush-700">
        ← All Classes
      </Link>

      <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: classItem.color }} />
            <h1 className="font-serif text-3xl font-semibold text-blush-900">{classItem.name}</h1>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blush-600">
            {classItem.meetings.map((m, i) => (
              <span key={i}>
                {m.day} {formatTime(m.startTime)}–{formatTime(m.endTime)}
              </span>
            ))}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-blush-500">
            {classItem.professor && <span>Prof. {classItem.professor}</span>}
            {classItem.location && <span>{classItem.location}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setEditClassOpen(true)}>
            Edit Class
          </Button>
          <Button variant="danger" onClick={handleDeleteClass}>
            Delete
          </Button>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-blush-900">Assignments</h2>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingTask(null);
                setTaskModalOpen(true);
              }}
            >
              + Add
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {openTasks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-blush-200 p-6 text-center text-sm text-blush-500">
                No open assignments for this class.
              </p>
            ) : (
              openTasks.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  showClass={false}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setTaskModalOpen(true);
                  }}
                />
              ))
            )}
          </div>

          {completedTasks.length > 0 && (
            <details className="mt-5">
              <summary className="cursor-pointer text-sm font-semibold text-blush-600">
                Completed ({completedTasks.length})
              </summary>
              <div className="mt-3 space-y-3">
                {completedTasks.map((t) => (
                  <TaskItem key={t.id} task={t} showClass={false} />
                ))}
              </div>
            </details>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-semibold text-blush-900">Notes</h2>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingNote(null);
                setNoteModalOpen(true);
              }}
            >
              + Add
            </Button>
          </div>
          <div className="mt-4 space-y-3">
            {notes.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-blush-200 p-6 text-center text-sm text-blush-500">
                No notes yet for this class.
              </p>
            ) : (
              notes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    setEditingNote(n);
                    setNoteModalOpen(true);
                  }}
                  className="block w-full rounded-2xl border border-blush-150 bg-white/70 p-4 text-left transition hover:shadow-[var(--shadow-soft)]"
                >
                  <p className="font-semibold text-blush-900">{n.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-blush-600">{n.body}</p>
                </button>
              ))
            )}
          </div>

          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-blush-900">Links &amp; Resources</h2>
            <ul className="mt-3 space-y-2">
              {classItem.links.map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-xl bg-blush-50/70 px-4 py-2.5">
                  <a href={l.url} target="_blank" rel="noreferrer" className="truncate text-sm font-semibold text-blush-700 hover:underline">
                    {l.label}
                  </a>
                  <button onClick={() => removeLink(l.id)} aria-label={`Remove link ${l.label}`} className="ml-2 text-xs text-blush-400 hover:text-blush-700">
                    ✕
                  </button>
                </li>
              ))}
            </ul>
            <form onSubmit={handleAddLink} className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2">
              <TextField id="link-label" label="Label" value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Syllabus" />
              <TextField id="link-url" label="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
              <div className="flex items-end">
                <Button type="submit" variant="secondary">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <TaskFormModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} initialTask={editingTask} defaultClassId={classItem.id} />
      <NoteFormModal isOpen={noteModalOpen} onClose={() => setNoteModalOpen(false)} initialNote={editingNote} defaultClassId={classItem.id} />
      <ClassFormModal isOpen={editClassOpen} onClose={() => setEditClassOpen(false)} initialClass={classItem} />
    </div>
  );
}
