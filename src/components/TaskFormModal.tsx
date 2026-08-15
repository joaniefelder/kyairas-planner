import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { TextField, SelectField, TextAreaField } from './ui/FormField';
import { Button } from './ui/Button';
import { useAppData } from '../hooks/AppDataContext';
import type { Priority, Task } from '../types';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  defaultClassId?: string | null;
  defaultDueDate?: string | null;
}

export function TaskFormModal({ isOpen, onClose, initialTask, defaultClassId = null, defaultDueDate = null }: TaskFormModalProps) {
  const { data, addTask, updateTask } = useAppData();
  const isEdit = !!initialTask;

  const [title, setTitle] = useState(initialTask?.title ?? '');
  const [classId, setClassId] = useState<string>(initialTask?.classId ?? defaultClassId ?? '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ?? defaultDueDate ?? '');
  const [dueTime, setDueTime] = useState(initialTask?.dueTime ?? '');
  const [priority, setPriority] = useState<Priority>(initialTask?.priority ?? 'Medium');
  const [notes, setNotes] = useState(initialTask?.notes ?? '');

  // Form state only initializes from props once (this component stays mounted
  // across open/close). Re-sync whenever the modal opens so edits always
  // reflect the current task instead of stale/blank fields.
  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialTask?.title ?? '');
    setClassId(initialTask?.classId ?? defaultClassId ?? '');
    setDueDate(initialTask?.dueDate ?? defaultDueDate ?? '');
    setDueTime(initialTask?.dueTime ?? '');
    setPriority(initialTask?.priority ?? 'Medium');
    setNotes(initialTask?.notes ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialTask]);

  function resetAndClose() {
    onClose();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = {
      title: title.trim(),
      classId: classId || null,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      priority,
      notes: notes.trim(),
    };
    if (isEdit && initialTask) {
      updateTask(initialTask.id, payload);
    } else {
      addTask(payload);
    }
    resetAndClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose} title={isEdit ? 'Edit Task' : 'Add a Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="task-title" label="Task" placeholder="Read chapter 4 notes" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        <div className="grid grid-cols-2 gap-3">
          <SelectField id="task-class" label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
            <option value="">General / Personal</option>
            {data.classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <SelectField id="task-priority" label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </SelectField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField id="task-due-date" label="Due date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <TextField id="task-due-time" label="Due time (optional)" type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} />
        </div>
        <TextAreaField id="task-notes" label="Notes" rows={3} placeholder="Anything to remember about this one..." value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Task'}</Button>
        </div>
      </form>
    </Modal>
  );
}
