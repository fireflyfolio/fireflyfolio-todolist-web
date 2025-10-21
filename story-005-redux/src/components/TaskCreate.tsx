import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createTask } from '../features/tasks/tasksSlice';
import type { Priority, Status } from '../types/types';
import { PRIORITY_VALUES, STATUS_VALUES } from '../helpers/labels';
import './TaskCreate.css';

export default function TaskCreate() {
  const dispatch = useAppDispatch();
  const nextId = useAppSelector(s => s.tasks.nextId); // affichage facultatif

  const [name, setName] = useState('');
  const [priority, setPriority] = useState<Priority>(0);
  const [status, setStatus] = useState<Status>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setName('');
    inputRef.current?.focus();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    dispatch(createTask({ name: n, priority, status }));
    reset();
  }

  return (
    <form className="taskcreate" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        placeholder="Enter a task"
        value={name}
        onChange={e => setName(e.target.value)}
        autoFocus
      />
      <select value={priority} onChange={e => setPriority(Number(e.target.value) as Priority)}>
        {PRIORITY_VALUES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
      </select>
      <select value={status} onChange={e => setStatus(Number(e.target.value) as Status)}>
        {STATUS_VALUES.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
      </select>
      <button type="submit" disabled={!name.trim()}>Create</button>
      <span style={{ marginLeft: 8, opacity: .6 }}>#{nextId}</span>
    </form>
  );
}
