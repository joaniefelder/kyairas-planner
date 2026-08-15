import { useAppData } from '../hooks/AppDataContext';
import type { Task, Priority } from '../types';
import { formatDateShort, formatTime12h } from '../utils/dateUtils';

const priorityStyles: Record<Priority, string> = {
  High: 'bg-blush-700 text-white',
  Medium: 'bg-blush-200 text-blush-800',
  Low: 'bg-blush-100 text-blush-600',
};

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showClass?: boolean;
}

export function TaskItem({ task, onEdit, showClass = true }: TaskItemProps) {
  const { data, toggleTaskComplete, deleteTask } = useAppData();
  const classItem = task.classId ? data.classes.find((c) => c.id === task.classId) : null;
  const completed = task.status === 'completed';

  return (
    <div
      className={`group flex items-start gap-3 rounded-2xl border border-blush-150 bg-white/70 p-4 transition-all duration-200 hover:shadow-[var(--shadow-soft)] ${
        completed ? 'opacity-60' : ''
      }`}
    >
      <button
        onClick={() => toggleTaskComplete(task.id)}
        aria-pressed={completed}
        aria-label={completed ? `Mark "${task.title}" as not completed` : `Mark "${task.title}" as completed`}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
          completed ? 'border-blush-600 bg-blush-600' : 'border-blush-300 bg-white hover:border-blush-500'
        }`}
      >
        {completed && (
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" className="animate-check-pop">
            <path d="M2.5 7.2l3 3 6-6.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={`text-sm font-semibold text-blush-900 ${completed ? 'line-through decoration-blush-500' : ''}`}>
            {task.title}
          </p>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blush-500">
          {showClass && classItem && (
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: classItem.color }} />
              {classItem.name}
            </span>
          )}
          {task.dueDate && (
            <span>
              Due {formatDateShort(task.dueDate)}
              {task.dueTime ? ` · ${formatTime12h(task.dueTime)}` : ''}
            </span>
          )}
        </div>
        {task.notes && <p className="mt-1.5 text-xs text-blush-500 italic">{task.notes}</p>}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
            className="rounded-full p-1.5 text-blush-500 hover:bg-blush-100 hover:text-blush-800"
          >
            <EditIcon />
          </button>
        )}
        <button
          onClick={() => deleteTask(task.id)}
          aria-label={`Delete ${task.title}`}
          className="rounded-full p-1.5 text-blush-500 hover:bg-blush-100 hover:text-blush-800"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2-7.5 7.5-2.5.5.5-2.5 7.5-7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M3 4.5h10M6.5 4.5v-1a1 1 0 011-1h1a1 1 0 011 1v1M4.5 4.5l.6 8.4a1 1 0 001 .9h3.8a1 1 0 001-.9l.6-8.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
