import { useState } from 'react';

import TaskCreate from './TaskCreate';
import TaskList from './TaskList';

import './TaskApp.css';

let allTasks = [];

export default function TaskApp() {
  const [nextId, setNextId] = useState(0);
  const [tasks, setTasks] = useState([]);

  function refreshAllTasks(t) {
    allTasks = [...t];
  }

  function handleCreateTask(task) {
    const _tasks = [...tasks, task];
    setTasks(_tasks);
    setNextId(nextId + 1);
    refreshAllTasks(_tasks);
  }

  function handleUpdateTask(task) {
    allTasks = allTasks.map(t => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    });

    const _tasks = tasks.map(t => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    });

    setTasks(_tasks);
  }

  function handleDeleteTask(id) {
    const _tasks = [...tasks.filter(t => t.id !== id)];
    setTasks(_tasks);
    refreshAllTasks(_tasks);
  }

  function handleSort(tasks) {
    setTasks(tasks);
  }

  function handleFilter(priority = -1, status = -1) {
    if (priority > -1 && status > -1) {
      setTasks([...allTasks.filter(t => t.priority === priority && t.status === status)]);
    } else if (priority > -1) {
      setTasks([...allTasks.filter(t => t.priority === priority)]);
    } else if (status > -1) {
      setTasks([...allTasks.filter(t => t.status === status)]);
    } else {
      setTasks([...allTasks]);
    }
  }

  return (
    <div className="taskapp">
      <TaskCreate nextId={nextId} onCreate={handleCreateTask} />
      <TaskList tasks={tasks} onUpdate={handleUpdateTask} onDelete={handleDeleteTask}
        onSort={handleSort} onFilter={handleFilter} />
    </div>
  );
}
