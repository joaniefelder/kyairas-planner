import { Link } from 'react-router-dom';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useAppData } from '../../hooks/AppDataContext';
import type { CalendarAgendaItem } from '../../utils/calendarItems';
import { formatTime12h } from '../../utils/dateUtils';

interface AgendaItemDetailModalProps {
  item: CalendarAgendaItem | null;
  onClose: () => void;
  onEditTask: () => void;
  onEditEvent: () => void;
}

export function AgendaItemDetailModal({ item, onClose, onEditTask, onEditEvent }: AgendaItemDetailModalProps) {
  const { data, deleteEvent, deleteTask, toggleTaskComplete } = useAppData();
  if (!item) return null;

  const classItem = item.kind === 'class' ? data.classes.find((c) => c.id === item.refId) : null;
  const task = item.kind === 'task' ? data.tasks.find((t) => t.id === item.refId) : null;
  const event = item.kind === 'event' ? data.events.find((e) => e.id === item.refId) : null;

  return (
    <Modal isOpen={!!item} onClose={onClose} title={item.title}>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-blush-600">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.startTime && (
            <span>
              {formatTime12h(item.startTime)}
              {item.endTime ? ` – ${formatTime12h(item.endTime)}` : ''}
            </span>
          )}
        </div>

        {item.kind === 'class' && classItem && (
          <>
            {classItem.location && <p className="text-sm text-blush-600">{classItem.location}</p>}
            {classItem.professor && <p className="text-sm text-blush-600">Prof. {classItem.professor}</p>}
            <Link to={`/classes/${classItem.id}`} onClick={onClose} className="inline-block text-sm font-semibold text-blush-700 underline">
              View class page
            </Link>
          </>
        )}

        {item.kind === 'event' && event && (
          <>
            {event.location && <p className="text-sm text-blush-600">{event.location}</p>}
            {event.notes && <p className="text-sm italic text-blush-500">{event.notes}</p>}
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={onEditEvent}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteEvent(event.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            </div>
          </>
        )}

        {item.kind === 'task' && task && (
          <>
            <p className="text-xs font-bold uppercase tracking-wide text-blush-500">{task.priority} priority</p>
            {task.notes && <p className="text-sm italic text-blush-500">{task.notes}</p>}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="secondary"
                onClick={() => {
                  toggleTaskComplete(task.id);
                }}
              >
                {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button variant="secondary" onClick={onEditTask}>
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  deleteTask(task.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
