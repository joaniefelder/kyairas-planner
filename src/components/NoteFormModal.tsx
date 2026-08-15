import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { TextField, SelectField, TextAreaField } from './ui/FormField';
import { Button } from './ui/Button';
import { useAppData } from '../hooks/AppDataContext';
import type { Note } from '../types';

interface NoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNote?: Note | null;
  defaultClassId?: string | null;
}

export function NoteFormModal({ isOpen, onClose, initialNote, defaultClassId = null }: NoteFormModalProps) {
  const { data, addNote, updateNote } = useAppData();
  const isEdit = !!initialNote;

  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [classId, setClassId] = useState(initialNote?.classId ?? defaultClassId ?? '');
  const [body, setBody] = useState(initialNote?.body ?? '');

  useEffect(() => {
    if (!isOpen) return;
    setTitle(initialNote?.title ?? '');
    setClassId(initialNote?.classId ?? defaultClassId ?? '');
    setBody(initialNote?.body ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialNote]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const payload = { title: title.trim(), body: body.trim(), classId: classId || null };
    if (isEdit && initialNote) {
      updateNote(initialNote.id, payload);
    } else {
      addNote(payload);
    }
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Note' : 'New Note'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField id="note-title" label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
        <SelectField id="note-class" label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
          <option value="">General note</option>
          {data.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <TextAreaField id="note-body" label="Note" rows={7} value={body} onChange={(e) => setBody(e.target.value)} />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{isEdit ? 'Save Changes' : 'Save Note'}</Button>
        </div>
      </form>
    </Modal>
  );
}
