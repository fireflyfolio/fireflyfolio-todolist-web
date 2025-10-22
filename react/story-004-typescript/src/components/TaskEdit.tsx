import { useEffect, useMemo, useRef, useState } from 'react';

import { STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';
import type { TaskEditProps, Task, Priority, Status } from '../types/types';

import './TaskEdit.css';

type DraftTask = { name: string; priority: Priority, status: Status };

export default function TaskEdit({ tasks, id, onUpdate, onCancel }: TaskEditProps) {
  const sourceTask = useMemo<Task | null>(
    () => tasks.find(t => t.id === id) ?? null,
    [tasks, id]
  );

  const [draft, setDraft] = useState<DraftTask>({
    name: '',
    priority: 0 as Priority,
    status: 0 as Status,
  });

  useEffect(() => {
    if (sourceTask) {
      setDraft({
        name: sourceTask.name,
        priority: sourceTask.priority,
        status: sourceTask.status,
      });
    } else {
      setDraft({
        name: '',
        priority: 0 as Priority,
        status: 0 as Status,
      });
    }
  }, [sourceTask]);

  const inputRef = useRef<HTMLInputElement>(null);

  if (!sourceTask) {
    return (
      <div className="TaskEdit">
        <em>Task not found.</em>
        <button type="button" onClick={onCancel}>Close</button>
      </div>
    );
  }

  const changed =
    draft.name.trim() !== sourceTask.name ||
    draft.priority !== sourceTask.priority ||
    draft.status !== sourceTask.status;

  function handleSubmit(e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const name = draft.name.trim();
    if (!name || !changed) return;

    onUpdate({
      id: id,
      name,
      priority: draft.priority,
      status: draft.status
    });
  }

  return (
    <form
      className="TaskEdit"
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel();
      }}
    >
      <input
        ref={inputRef}
        placeholder="Enter a task"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        autoFocus
        aria-label="Task name"
      />

      <select
        value={draft.priority}
        onChange={(e) => setDraft({ ...draft, priority: Number(e.target.value) as Priority })}
        aria-label="Priority"
      >
        {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>

      <select
        value={draft.status}
        onChange={(e) => setDraft({ ...draft, status: Number(e.target.value) as Status })}
        aria-label="Status"
      >
        {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>

      <button type="submit" disabled={!draft.name.trim() || !changed}>Update</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}
