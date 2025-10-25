
import { useState, useRef } from 'react';

import './TaskApp.css';

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState(null);
  const [name, setName] = useState('');
  const nextIdRef = useRef(0);
  const inputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleUpdateClick();
    if (e.key === 'Escape') handleEditClick();
  }

  function handleUpdateClick() {
    if (!name.trim()) return;

    if (task === null) {
      const newTask = {
        id: nextIdRef.current++,
        name: name.trim(),
        status: 'Todo',
        priority: 'Normal',
      };
      setTasks([...tasks, newTask]);
    } else {
      setTasks(tasks.map(t => (t.id === task.id ? { ...t, name: name.trim() } : t)));
      setTask(null);
    }

    setName('');
    inputRef.current.focus();
  }

  function handleEditClick(id = null) {
    if (task === null && id !== null) {
      const found = tasks.find(t => t.id === id);
      setTask(found);
      setName(found.name ?? null);
    } else {
      setTask(null);
      setName('');
    }

    inputRef.current.focus();
  }

  function handleDeleteClick(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  return (
    <div className="TaskApp">
      <div className="head">
        <input className="task" placeholder="Enter a task" ref={inputRef} value={name}
          onChange={e => setName(e.target.value)} onKeyDown={handleKeyDown} autoFocus />
        <button onClick={handleUpdateClick}>{task === null ? 'Create' : 'Update'}</button>
      </div>
      <div className="body">
        <ol>
          {tasks.map((t) =>
            <li key={t.id}>
              <span className="task">{t.name}</span>
              <button onClick={() => handleEditClick(t.id)}>{task?.id === t.id ? 'Cancel' : 'Edit'}</button>
              <button onClick={() => handleDeleteClick(t.id)}>Delete</button>
            </li>)}
        </ol>
      </div>
    </div>
  );
}
