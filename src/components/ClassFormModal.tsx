import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { TextField } from './ui/FormField';
import { Button } from './ui/Button';
import { useAppData } from '../hooks/AppDataContext';
import { CLASS_COLORS } from '../data/defaultClasses';
import { DAYS_OF_WEEK } from '../types';
import type { ClassItem, ClassMeeting, DayOfWeek } from '../types';

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialClass?: ClassItem | null;
}

const DEFAULT_MEETINGS: ClassMeeting[] = [{ day: 'Mon', startTime: '09:00', endTime: '10:00' }];

export function ClassFormModal({ isOpen, onClose, initialClass }: ClassFormModalProps) {
  const { data, addClass, updateClass } = useAppData();
  const isEdit = !!initialClass;

  const [name, setName] = useState(initialClass?.name ?? '');
  const [professor, setProfessor] = useState(initialClass?.professor ?? '');
  const [location, setLocation] = useState(initialClass?.location ?? '');
  const [color, setColor] = useState(initialClass?.color ?? CLASS_COLORS[data.classes.length % CLASS_COLORS.length]);
  const [meetings, setMeetings] = useState<ClassMeeting[]>(initialClass?.meetings ?? DEFAULT_MEETINGS);

  useEffect(() => {
    if (!isOpen) return;
    setName(initialClass?.name ?? '');
    setProfessor(initialClass?.professor ?? '');
    setLocation(initialClass?.location ?? '');
    setColor(initialClass?.color ?? CLASS_COLORS[data.classes.length % CLASS_COLORS.length]);
    setMeetings(initialClass?.meetings ?? DEFAULT_MEETINGS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialClass]);

  function updateMeeting(idx: number, updates: Partial<ClassMeeting>) {
    setMeetings((prev) => prev.map((m, i) => (i === idx ? { ...m, ...updates } : m)));
  }
  function addMeeting() {
    setMeetings((prev) => [...prev, { day: 'Mon', startTime: '09:00', endTime: '10:00' }]);
  }
  function removeMeeting(idx: number) {
    setMeetings((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const payload = { name: name.trim(), professor: professor.trim(), location: location.trim(), color, meetings };
    if (isEdit && initialClass) {
      updateClass(initialClass.id, payload);
    } else {
      addClass({ ...payload, links: [] });
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Class' : 'Add a Class'} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="class-name" label="Class name" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
        <div className="grid grid-cols-2 gap-3">
          <TextField id="class-professor" label="Professor" value={professor} onChange={(e) => setProfessor(e.target.value)} />
          <TextField id="class-location" label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div>
          <p className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-blush-600">Color</p>
          <div className="flex flex-wrap gap-2">
            {CLASS_COLORS.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Use color ${c}`}
                aria-pressed={color === c}
                className={`h-8 w-8 rounded-full border-2 transition ${color === c ? 'border-blush-900 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-blush-600">Meeting times</p>
            <button type="button" onClick={addMeeting} className="text-xs font-semibold text-blush-600 hover:text-blush-800">
              + Add meeting
            </button>
          </div>
          <div className="space-y-2">
            {meetings.map((m, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                <select
                  aria-label={`Day for meeting ${idx + 1}`}
                  value={m.day}
                  onChange={(e) => updateMeeting(idx, { day: e.target.value as DayOfWeek })}
                  className="rounded-xl border border-blush-200 bg-white/70 px-2 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`Start time for meeting ${idx + 1}`}
                  type="time"
                  value={m.startTime}
                  onChange={(e) => updateMeeting(idx, { startTime: e.target.value })}
                  className="rounded-xl border border-blush-200 bg-white/70 px-2 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                />
                <input
                  aria-label={`End time for meeting ${idx + 1}`}
                  type="time"
                  value={m.endTime}
                  onChange={(e) => updateMeeting(idx, { endTime: e.target.value })}
                  className="rounded-xl border border-blush-200 bg-white/70 px-2 py-2 text-sm text-blush-900 focus:border-blush-500 focus:outline-none focus:ring-2 focus:ring-blush-200"
                />
                <button
                  type="button"
                  onClick={() => removeMeeting(idx)}
                  disabled={meetings.length === 1}
                  aria-label={`Remove meeting ${idx + 1}`}
                  className="rounded-xl px-2 text-blush-500 hover:bg-blush-100 disabled:opacity-30"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Class'}</Button>
        </div>
      </form>
    </Modal>
  );
}
