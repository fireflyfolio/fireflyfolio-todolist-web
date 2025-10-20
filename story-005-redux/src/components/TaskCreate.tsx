import { useRef, useState } from 'react';
import { STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';
import type { TaskCreateProps, Priority, Status } from '../types/types';

import './TaskCreate.css';

type DraftTask = { name: string; priority: Priority, status: Status };

export default function TaskCreate({ nextId, onCreate }: TaskCreateProps) {
  const [task, setTask] = useState<DraftTask>({
    name: '',
    priority: 0 as Priority,
    status: 0 as Status,
  });

  const lastSelRef = useRef<{priority: Priority, status: Status}>({
    priority: 0 as Priority,
    status: 0 as Status,
  });

  function resetTask() {
    setTask({ name: '', ...lastSelRef.current });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement> | React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const name = task.name.trim();
    if (!name) return;

    onCreate({
      name,
      priority: task.priority,
      status: task.status,
    });

    lastSelRef.current = { priority: task.priority, status: task.status };
    resetTask();
  }

  return (
    <form className="TaskCreate" onSubmit={handleSubmit}>
      <input
        placeholder="Enter a task"
        value={task.name}
        onChange={e => setTask({ ...task, name: e.target.value })}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }}
        autoFocus
      />
      <select
        value={task.priority}
        onChange={e => setTask({ ...task, priority: Number(e.target.value) as Priority })}
      >
        {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>
      <select
        value={task.status}
        onChange={e => setTask({ ...task, status: Number(e.target.value) as Status })}
      >
        {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>
      <button type="submit" disabled={!task.name.trim()}>Create</button>
    </form>
  );
}
