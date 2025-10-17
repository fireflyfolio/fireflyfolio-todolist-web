import { useRef, useState } from 'react';
import './TaskCreate.css';

export default function TaskCreate({ nextId, onCreate }) {
  const [task, setTask] = useState({ id: null, name: '', priority: 0, status: 0 });
  const lastSelRef = useRef({ priority: 0, status: 0 });

  function resetTask() {
    setTask({ id: null, name: '', ...lastSelRef.current });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const name = task.name.trim();
    if (!name) return;

    onCreate({
      id: nextId,
      name,
      priority: Number(task.priority),
      status: Number(task.status),
    });

    lastSelRef.current = {
      priority: Number(task.priority),
      status: Number(task.status),
    };

    resetTask();
  }

  return (
    <form className="taskcreate" onSubmit={handleSubmit}>
      <input
        placeholder="Enter a task"
        value={task.name}
        onChange={e => setTask({ ...task, name: e.target.value })}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e); }}
        autoFocus
      />
      <select
        value={task.priority}
        onChange={e => setTask({ ...task, priority: Number(e.target.value) })}
      >
        <option value={0}>Low</option>
        <option value={1}>Normal</option>
        <option value={2}>High</option>
        <option value={3}>Urgent</option>
      </select>
      <select
        value={task.status}
        onChange={e => setTask({ ...task, status: Number(e.target.value) })}
      >
        <option value={0}>Todo</option>
        <option value={1}>Doing</option>
        <option value={2}>Done</option>
      </select>
      <button type="submit" disabled={!task.name.trim()}>Create</button>
    </form>
  );
}
