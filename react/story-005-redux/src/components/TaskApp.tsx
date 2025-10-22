import TaskCreate from './TaskCreate';
import TaskList from './TaskList';

import './TaskApp.css';

export default function TaskApp() {
  return (
    <div className="TaskApp">
      <TaskCreate />
      <TaskList />
    </div>
  );
}
