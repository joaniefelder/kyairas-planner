import { useMemo, useState } from 'react';
import { useAppData } from '../hooks/AppDataContext';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { Button } from '../components/ui/Button';
import type { Task } from '../types';
import { toISODate, daysBetween } from '../utils/dateUtils';

type Filter = 'all' | 'today' | 'upcoming' | 'completed';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
];

export function Todo() {
  const { data } = useAppData();
  const [filter, setFilter] = useState<Filter>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const todayISO = toISODate(new Date());
    return data.tasks
      .filter((t) => {
        if (filter === 'completed') return t.status === 'completed';
        if (t.status === 'completed') return false;
        if (filter === 'today') return t.dueDate === todayISO;
        if (filter === 'upcoming') return !!t.dueDate && daysBetween(todayISO, t.dueDate) > 0;
        return true;
      })
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [data.tasks, filter]);

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  function openAdd() {
    setEditingTask(null);
    setModalOpen(true);
  }

  return (
    <div>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-blush-900">To-Do List</h1>
          <p className="mt-1 text-blush-600">Everything on your plate, in one place.</p>
        </div>
        <Button onClick={openAdd}>+ Add Task</Button>
      </header>

      <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Task filters">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filter === f.key ? 'bg-blush-600 text-white shadow-[var(--shadow-soft)]' : 'bg-blush-100 text-blush-700 hover:bg-blush-150'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-blush-200 p-8 text-center text-sm text-blush-500">
            Nothing here yet.
          </p>
        ) : (
          filtered.map((task) => <TaskItem key={task.id} task={task} onEdit={openEdit} />)
        )}
      </div>

      <TaskFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTask={editingTask} />
    </div>
  );
}
