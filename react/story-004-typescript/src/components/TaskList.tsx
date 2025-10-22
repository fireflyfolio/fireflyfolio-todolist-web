import { useState } from 'react';

import TaskEdit from './TaskEdit';
import { getStatusLabel, getPriorityLabel, STATUS_VALUES, PRIORITY_VALUES } from '../helpers/labels';
import type { TaskListProps, Task, PriorityFilter, StatusFilter} from '../types/types';

import './TaskList.css';

export default function TaskList({ tasks, onUpdate, onDelete, onSort, onFilter }: TaskListProps) {
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>(-1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(-1);
  const [editId, setEditId] = useState<number | null>(null);

  function handleEditClick(id: number) {
    setEditId(id);
  }

  function handleUpdateClick(task: Task) {
    onUpdate(task);
    setEditId(null);
  }

  function handleCancelClick() {
    setEditId(null);
  }

  function handleSortingClick(property: keyof Task) {
    const sorted = [...tasks];

    switch (property) {
      case 'id': sorted.sort((a, b) => a.id - b.id); break;
      case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'priority': sorted.sort((a, b) => a.priority - b.priority); break;
      case 'status': sorted.sort((a, b) => a.status - b.status); break;
      default: break;
    }

    onSort(sorted);
  }

  function handlePriorityFilter(priority: number) {
    priority = Number(priority) ;
    setPriorityFilter(priority as PriorityFilter);
    onFilter(priority as PriorityFilter, statusFilter as StatusFilter);
  }

  function handleStatusFilter(status: number) {
    status = Number(status);
    setStatusFilter(status as StatusFilter);
    onFilter(priorityFilter as PriorityFilter, status as StatusFilter);
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
              <td colSpan={5} className="edit">
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
        <select value={priorityFilter} onChange={(e) => handlePriorityFilter(Number(e.target.value))}>
          <option value="-1">All Priorities</option>
          {PRIORITY_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => handleStatusFilter(Number(e.target.value))}>
          <option value="-1">All Statuses</option>
          {STATUS_VALUES.map(v => <option value={v.value}>{v.label}</option>)}
        </select>
      </div>
    </div>
  );
}
