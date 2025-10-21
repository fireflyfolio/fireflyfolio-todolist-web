import { useMemo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateTask, cancelEdit } from '../features/tasks/tasksSlice';
import { PRIORITY_VALUES, STATUS_VALUES } from '../helpers/labels';
import type { Priority, Status, Task } from '../types/types';

import './TaskEdit.css';

export default function TaskEdit({ id }: { id: number }) {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(s => s.tasks.view); // ou s.tasks.all
  const source = useMemo(() => tasks.find(t => t.id === id) ?? null, [tasks, id]);

  const [name, setName] = useState(source?.name ?? '');
  const [priority, setPriority] = useState<Priority>((source?.priority ?? 0) as Priority);
  const [status, setStatus] = useState<Status>((source?.status ?? 0) as Status);

  if (!source) {
    return (
      <div className="TaskEdit">
        <em>Task not found.</em>
        <button type="button" onClick={() => dispatch(cancelEdit())}>Close</button>
      </div>
    );
  }

  const changed =
    name.trim() !== source.name ||
    priority !== source.priority ||
    status !== source.status;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n || !changed) return;
    const updated: Task = { id: id, name: n, priority, status };
    dispatch(updateTask(updated));
  }

  return (
    <form className="TaskEdit" onSubmit={handleSubmit} onKeyDown={(e) => { if (e.key === 'Escape') dispatch(cancelEdit()); }}>
      <input value={name} onChange={e => setName(e.target.value)} autoFocus aria-label="Task name" />
      <select value={priority} onChange={e => setPriority(Number(e.target.value) as Priority)}>
        {PRIORITY_VALUES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
      </select>
      <select value={status} onChange={e => setStatus(Number(e.target.value) as Status)}>
        {STATUS_VALUES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
      </select>
      <button type="submit" disabled={!changed || !name.trim()}>Update</button>
      <button type="button" onClick={() => dispatch(cancelEdit())}>Cancel</button>
    </form>
  );
}
