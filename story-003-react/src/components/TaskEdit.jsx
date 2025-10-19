import { useState } from 'react';
import { STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';

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
    <div className="TaskEdit">
      <input placeholder="Enter a task" value={task.name} onKeyDown={handleKeyDown}
        onChange={e => setTask({...task, name: e.target.value})} autoFocus />
      <select value={task.priority} onChange={e => setTask({...task, priority: parseInt(e.target.value)})}>
        {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>
      <select value={task.status} onChange={e => setTask({...task, status: parseInt(e.target.value)})}>
        {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
      </select>
      <button onClick={handleUpdateClick}>Update</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}
