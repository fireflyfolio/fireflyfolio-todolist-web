import { useCallback, useRef, useState } from 'react';

import TaskCreate from './TaskCreate';
import TaskList from './TaskList';

import './TaskApp.css';

export default function TaskApp() {
  const allTasksRef = useRef([]);
  const nextIdRef = useRef(0);

  const [tasks, setTasks] = useState([]);

  const refreshFromAll = useCallback(() => {
    setTasks([...allTasksRef.current]);
  }, []);

  const handleCreateTask = useCallback((partialTask) => {
    const task = {
      id: nextIdRef.current++,
      name: partialTask.name?.trim() ?? '',
      priority: Number(partialTask.priority ?? 0),
      status: Number(partialTask.status ?? 0),
    };

    allTasksRef.current = [...allTasksRef.current, task];
    setTasks((prev) => [...prev, task]);
  }, []);

  const handleUpdateTask = useCallback((updated) => {
    const u = {
      ...updated,
      name: updated.name?.trim() ?? '',
      priority: Number(updated.priority ?? 0),
      status: Number(updated.status ?? 0),
    };

    allTasksRef.current = allTasksRef.current.map(t => (t.id === u.id ? u : t));
    setTasks(prev => prev.map(t => (t.id === u.id ? u : t)));
  }, []);

  const handleDeleteTask = useCallback((id) => {
    allTasksRef.current = allTasksRef.current.filter(t => t.id !== id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleSort = useCallback((sortedTasks) => {
    const ids = new Set(sortedTasks.map(t => t.id));
    const sortedMap = new Map(sortedTasks.map(t => [t.id, t]));
    allTasksRef.current = allTasksRef.current
      .filter(t => ids.has(t.id))
      .map(t => sortedMap.get(t.id));
    setTasks(sortedTasks);
  }, []);

  const handleFilter = useCallback((priority = -1, status = -1) => {
    const p = Number(priority);
    const s = Number(status);

    let base = allTasksRef.current;
    if (p > -1 && s > -1) {
      setTasks(base.filter(t => t.priority === p && t.status === s));
    } else if (p > -1) {
      setTasks(base.filter(t => t.priority === p));
    } else if (s > -1) {
      setTasks(base.filter(t => t.status === s));
    } else {
      setTasks([...base]);
    }
  }, []);

 const handleResetView = useCallback(() => {
    refreshFromAll();
  }, [refreshFromAll]);

 return (
    <div className="TaskApp">
      <TaskCreate nextId={nextIdRef.current} onCreate={handleCreateTask} />
      <TaskList
        tasks={tasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onSort={handleSort}
        onFilter={handleFilter}
        onResetView={handleResetView}
      />
    </div>
  );
}
