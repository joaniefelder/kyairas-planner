import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { TextField, TextAreaField } from './ui/FormField';
import { Button } from './ui/Button';
import { useAppData } from '../hooks/AppDataContext';
import type { CalendarEvent } from '../types';
import { toISODate } from '../utils/dateUtils';

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEvent?: CalendarEvent | null;
  defaultDate?: string | null;
}

export function EventFormModal({ isOpen, onClose, initialEvent, defaultDate }: EventFormModalProps) {
  const { addEvent, updateEvent } = useAppData();
  const isEdit = !!initialEvent;

  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [date, setDate] = useState(initialEvent?.date ?? defaultDate ?? toISODate(new Date()));
  const [startTime, setStartTime] = useState(initialEvent?.startTime ?? '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime ?? '');
  const [location, setLocation] = useState(initialEvent?.location ?? '');
  const [notes, setNotes] = useState(initialEvent?.notes ?? '');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialEvent?.title ?? '');
    setDate(initialEvent?.date ?? defaultDate ?? toISODate(new Date()));
    setStartTime(initialEvent?.startTime ?? '');
    setEndTime(initialEvent?.endTime ?? '');
    setLocation(initialEvent?.location ?? '');
    setNotes(initialEvent?.notes ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialEvent]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    const payload = {
      title: title.trim(),
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      location: location.trim(),
      notes: notes.trim(),
    };
    if (isEdit && initialEvent) {
      updateEvent(initialEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Event' : 'Add an Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="event-title" label="Event" placeholder="Study group, coffee date, doctor's appt..." value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        <TextField id="event-date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <TextField id="event-start" label="Start time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          <TextField id="event-end" label="End time" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <TextField id="event-location" label="Location" placeholder="Optional" value={location} onChange={(e) => setLocation(e.target.value)} />
        <TextAreaField id="event-notes" label="Notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Add Event'}</Button>
        </div>
      </form>
    </Modal>
  );
}
