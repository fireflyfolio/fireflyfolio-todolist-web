import { useAppDispatch, useAppSelector } from '../store/hooks';
import { deleteTask, sortView, setPriorityFilter, setStatusFilter, startEdit } from '../features/tasks/tasksSlice';
import { getPriorityLabel, getStatusLabel } from '../helpers/labels';
import type { PriorityFilter, StatusFilter, Task } from '../types/types';
import TaskEdit from './TaskEdit';

import './TaskList.css';

export default function TaskList() {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(s => s.tasks.view);
  const editingId = useAppSelector(s => s.tasks.editingId);
  const filters = useAppSelector(s => s.tasks.filters);

  function handleSortingClick(key: 'id'|'name'|'priority'|'status') {
    dispatch(sortView(key));
  }

  function handlePriorityFilter(value: string) {
    dispatch(setPriorityFilter(Number(value) as PriorityFilter));
  }

  function handleStatusFilter(value: string) {
    dispatch(setStatusFilter(Number(value) as StatusFilter));
  }

  return (
    <div className="tasklist">
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
          {tasks.map((t: Task) =>
            editingId === t.id ? (
              <tr key={t.id}>
                <td colSpan={5} className="edit">
                  <TaskEdit id={t.id} />
                </td>
              </tr>
            ) : (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.name}</td>
                <td>{getPriorityLabel(t.priority)}</td>
                <td>{getStatusLabel(t.status)}</td>
                <td>
                  <button type="button" onClick={() => dispatch(startEdit(t.id))}>Edit</button>
                  <button type="button" onClick={() => dispatch(deleteTask(t.id))}>Delete</button>
                </td>
              </tr>
            )
          )}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <select value={filters.priority} onChange={(e) => handlePriorityFilter(e.target.value)}>
          <option value={-1}>All Priorities</option>
          <option value={0}>Low</option>
          <option value={1}>Normal</option>
          <option value={2}>High</option>
          <option value={3}>Urgent</option>
        </select>

        <select value={filters.status} onChange={(e) => handleStatusFilter(e.target.value)}>
          <option value={-1}>All Statuses</option>
          <option value={0}>Todo</option>
          <option value={1}>Doing</option>
          <option value={2}>Done</option>
        </select>
      </div>
    </div>
  );
}
