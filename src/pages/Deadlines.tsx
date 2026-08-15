import { useMemo, useState } from 'react';
import { useAppData } from '../hooks/AppDataContext';
import { groupDeadline } from '../hooks/useDerivedSchedule';
import type { DeadlineGroup } from '../hooks/useDerivedSchedule';
import type { Task } from '../types';
import { toISODate, daysBetween, formatDateFriendly } from '../utils/dateUtils';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';

const GROUP_ORDER: DeadlineGroup[] = ['overdue', 'today', 'thisWeek', 'nextWeek', 'later'];

const GROUP_META: Record<DeadlineGroup, { title: string; className: string }> = {
  overdue: { title: 'Overdue', className: 'border-blush-800/40 bg-blush-800/5' },
  today: { title: 'Due Today', className: 'border-blush-400 bg-blush-100/50' },
  thisWeek: { title: 'This Week', className: 'border-blush-200 bg-white/60' },
  nextWeek: { title: 'Next Week', className: 'border-blush-200 bg-white/60' },
  later: { title: 'Later', className: 'border-blush-150 bg-white/50' },
};

function daysRemainingLabel(task: Task, todayISO: string): string {
  if (!task.dueDate) return '';
  const diff = daysBetween(todayISO, task.dueDate);
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? '' : 's'} overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `${diff} days left`;
}

export function Deadlines() {
  const { data } = useAppData();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const groups = useMemo(() => {
    const todayISO = toISODate(new Date());
    const withDeadlines = data.tasks.filter((t) => t.status !== 'completed' && t.dueDate);
    const buckets: Record<DeadlineGroup, Task[]> = { overdue: [], today: [], thisWeek: [], nextWeek: [], later: [] };
    for (const t of withDeadlines) {
      buckets[groupDeadline(t, todayISO)].push(t);
    }
    for (const key of GROUP_ORDER) {
      buckets[key].sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1));
    }
    return buckets;
  }, [data.tasks]);

  const todayISO = toISODate(new Date());

  return (
    <div>
      <header>
        <h1 className="font-serif text-3xl font-semibold text-blush-900">Deadlines</h1>
        <p className="mt-1 text-blush-600">Nothing sneaks up on you here.</p>
      </header>

      <div className="mt-7 space-y-8">
        {GROUP_ORDER.map((key) => {
          const tasks = groups[key];
          if (tasks.length === 0) return null;
          const meta = GROUP_META[key];
          return (
            <section key={key}>
              <div className="mb-3 flex items-center gap-2">
                <h2 className={`font-serif text-lg font-semibold ${key === 'overdue' ? 'text-blush-800' : 'text-blush-800'}`}>
                  {meta.title}
                </h2>
                <span className="rounded-full bg-blush-100 px-2 py-0.5 text-xs font-bold text-blush-600">{tasks.length}</span>
              </div>
              <div className={`space-y-3 rounded-3xl border p-4 ${meta.className}`}>
                {tasks.map((task) => (
                  <div key={task.id}>
                    <TaskItem
                      task={task}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setModalOpen(true);
                      }}
                    />
                    <p className={`mt-1 pl-3 text-xs font-semibold ${key === 'overdue' ? 'text-blush-800' : 'text-blush-500'}`}>
                      {daysRemainingLabel(task, todayISO)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {Object.values(groups).every((g) => g.length === 0) && (
          <p className="rounded-2xl border border-dashed border-blush-200 p-8 text-center text-sm text-blush-500">
            No deadlines on the horizon. Enjoy the breathing room ♡
          </p>
        )}
      </div>

      <TaskFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialTask={editingTask} />
      <p className="mt-2 text-xs text-blush-400">Tasks without a due date live in your To-Do list under "All".</p>
      <div className="mt-1 text-xs text-blush-300">{formatDateFriendly(todayISO)}</div>
    </div>
  );
}
