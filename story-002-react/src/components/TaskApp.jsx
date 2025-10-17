import { useState, useRef } from 'react';

import { getStatusLabel, getPriorityLabel } from '../helpers/labels';
import './TaskApp.css';

let nextId = 0;
let allTasks = [];

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ id: null, name: '', priority: 0, status: 0 });
  const [priorityFilter, setPriorityFilter] = useState(-1);
  const [statusFilter, setStatusFilter] = useState(-1);
  const inputRef = useRef(null);

  function filterTasks(priority = -1, status = -1) {
    if (priority > -1 && status > -1)
      return allTasks.filter(t => t.priority === priority && t.status === status);
    else if (priority > -1)
      return allTasks.filter(t => t.priority === priority);
    else if (status > -1)
      return allTasks.filter(t => t.status === status);

    return [...allTasks];
 }

  function resetTask() {
    setTask({ id: null, name: '', priority: 0, status: 0 });
 }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleUpdateClick();
    if (e.key === 'Escape') handleEditClick();
 }

  function handleUpdateClick() {
    if (task.id === null) {
      const create = { ...task, id: nextId++ };
      setTask(create);
      allTasks.push(create);
   } else {
      const index = allTasks.findIndex(t => t.id === task.id);
      const update = allTasks[index];

      update.name = task.name;
      update.priority = parseInt(task.priority);
      update.status = parseInt(task.status);

      allTasks.splice(index, 1, update);
   }

    setTasks([...allTasks]);
    resetTask();
 }

  function handleEditClick(id = null) {
    if (task.id === null && id !== null) {
      setTask(tasks.find(t => t.id === id));
   } else {
      resetTask();
   }

    inputRef.current.focus();
 }

  function handleDeleteClick(id) {
    allTasks = allTasks.filter(t => t.id !== id);
    setTasks([...allTasks]);
 }

  function handleSortingClick(property) {
    const sorted = [...tasks];

    switch (property) {
      case 'id':
        sorted.sort((a, b) => a.id - b.id);
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priority':
        sorted.sort((a, b) => a.priority - b.priority);
        break;
      case 'status':
        sorted.sort((a, b) => a.status - b.status);
        break;
   }

    setTasks(sorted);
 }

  function handlePriorityFilter(priority) {
    priority = parseInt(priority);

    setTasks(filterTasks(priority, statusFilter));
    setPriorityFilter(priority);
 }

  function handleStatusFilter(status) {
    status = parseInt(status);

    setTasks(filterTasks(priorityFilter, status));
    setStatusFilter(status);
 }

  return (
    <div className="TaskApp">
      <div className="header">
        <input placeholder="Enter a task" ref={inputRef} value={task.name} onKeyDown={handleKeyDown}
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
        <button onClick={handleUpdateClick}>{task.id === null ? 'Create' : 'Update'}</button>
      </div>
      <div className="body">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSortingClick('id')}>ID</th>
              <th onClick={() => handleSortingClick('name')}>Task</th>
              <th onClick={() => handleSortingClick('priority')}>Priority</th>
              <th onClick={() => handleSortingClick('status')}>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {tasks.map((t) =>
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{getPriorityLabel(t.priority)}</td>
              <td>{getStatusLabel(t.status)}</td>
              <td>
                <button onClick={() => handleEditClick(t.id)}>{task?.id === t.id ? 'Cancel' : 'Edit'}</button>
                <button onClick={() => handleDeleteClick(t.id)}>Delete</button>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <select value={priorityFilter} onChange={(e) => handlePriorityFilter(e.target.value)}>
          <option value="-1">All Priorities</option>
          <option value="0">Low</option>
          <option value="1">Normal</option>
          <option value="2">High</option>
          <option value="3">Urgent</option>
        </select>
        <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value="-1">All Statuses</option>
          <option value="0">Todo</option>
          <option value="1">Doing</option>
          <option value="2">Done</option>
        </select>
      </div>
    </div>
  );
}
