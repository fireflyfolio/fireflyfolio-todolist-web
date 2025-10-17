import { useState } from 'react';

import './TaskEdit.css';

export default function TaskEdit({ tasks, id, onUpdate, onCancel }) {
  const [task, setTask] = useState({ ...tasks.find(t => t.id === id) });

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleUpdateClick();
    if (e.key === 'Escape') onCancel();
  }

  function handleUpdateClick() {
    onUpdate({
      id: task.id,
      name: task.name,
      priority: parseInt(task.priority),
      status: parseInt(task.status),
    });
  }

  return (
    <div className="taskedit">
      <input placeholder="Enter a task" value={task.name} onKeyDown={handleKeyDown}
        onChange={e => setTask({...task, name: e.target.value})} autoFocus />
      <select value={task.priority} onChange={e => setTask({...task, priority: parseInt(e.target.value)})}>
        <option value="0">Low</option>
        <option value="1">Normal</option>
        <option value="2">High</option>
        <option value="3">Urgent</option>
      </select>
      <select value={task.status} onChange={e => setTask({...task, status: parseInt(e.target.value)})}>
        <option value="0">Todo</option>
        <option value="1">Doing</option>
        <option value="2">Done</option>
      </select>
      <button onClick={handleUpdateClick}>Update</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
