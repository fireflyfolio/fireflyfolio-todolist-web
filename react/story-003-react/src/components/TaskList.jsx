import { useState } from 'react';

import TaskEdit from './TaskEdit';
import { getStatusLabel, getPriorityLabel, STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';

import './TaskList.css';

export default function TaskList({ tasks, onUpdate, onDelete, onSort, onFilter }) {
  const [priorityFilter, setPriorityFilter] = useState(-1);
  const [statusFilter, setStatusFilter] = useState(-1);
  const [editId, setEditId] = useState(null);

  function handleEditClick(id) {
    setEditId(id);
  }

  function handleUpdateClick(task) {
    onUpdate(task);
    setEditId(null);
  }

  function handleCancelClick() {
    setEditId(null);
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
        break;a.name > b.name
      case 'status':
        sorted.sort((a, b) => a.status - b.status);
        break;
    }

    onSort(sorted);
  }

  function handlePriorityFilter(priority) {
    priority = parseInt(priority);
    setPriorityFilter(priority);
    onFilter(priority, statusFilter);
  }

  function handleStatusFilter(status) {
    status = parseInt(status);
    setStatusFilter(status);
    onFilter(priorityFilter, status);
  }

  return (
    <div className="TaskList">
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
          {tasks.map((t) => editId === t.id ?
            <tr key={t.id}>
              <td colSpan="5" className="edit">
                <TaskEdit tasks={tasks} id={editId} onUpdate={handleUpdateClick} onCancel={handleCancelClick} />
              </td>
            </tr> :
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{getPriorityLabel(t.priority)}</td>
              <td>{getStatusLabel(t.status)}</td>
              <td>
                <button onClick={() => handleEditClick(t.id)}>Edit</button>
                <button onClick={() => onDelete(t.id)}>Delete</button>
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <select value={priorityFilter} onChange={(e) => handlePriorityFilter(e.target.value)}>
          <option value="-1">All Priorities</option>
          {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value="-1">All Statuses</option>
          {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
        </select>
      </div>
    </div>
  );
}
