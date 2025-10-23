import { Component } from '@angular/core';

import { TaskType } from '../../interfaces/task-type.interface';
import { FilterType } from '../../interfaces/filter-type.interface';
import { TaskCreate } from '../task-create/task-create.component';
import { TaskList } from '../task-list/task-list.component';

@Component({
  selector: 'task-app',
  imports: [TaskCreate, TaskList],
  templateUrl: './task-app.component.html',
  styleUrl: './task-app.component.css'
})
export class TaskApp {
  nextId = 0;
  allTasks = <TaskType[]>[];
  tasks = <TaskType[]>[];

  refreshAllTasks(t: TaskType[]) {
    this.allTasks = [...t];
  }

  handleCreateTask(task: TaskType) {
    this.tasks.push(task);
    this.nextId++;
    this.refreshAllTasks(this.tasks);
  }

  handleUpdateTask(task: TaskType) {
    this.allTasks = this.allTasks.map((t: TaskType) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    });

    const _tasks = this.tasks.map((t: TaskType) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    });

    this.tasks = _tasks;
  }

  handleDeleteTask(id: number | null) {
    const _tasks = [...this.tasks.filter((t: TaskType) => t.id !== id)];
    this.tasks = _tasks;
    this.refreshAllTasks(_tasks);
  }

  handleSort(property: string) {
    switch (property) {
      case 'id':
        this.tasks.sort((a: TaskType, b: TaskType) => {
          if (a.id !== null && b.id !== null) return a.id - b.id;
          if (a.id !== null && b.id === null) return 1;
          if (a.id === null && b.id !== null) return -1;
          return 0;
        });
        break;
      case 'name':
        this.tasks.sort((a: TaskType, b: TaskType) => {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
          return 0;
        });
        break;
      case 'priority':
        this.tasks.sort((a: TaskType, b: TaskType) => a.priority - b.priority);
        break;
      case 'status':
        this.tasks.sort((a: TaskType, b: TaskType) => a.status - b.status);
        break;
    }
  }

  handleFilter(filter: FilterType) {
    if (filter.priority > -1 && filter.status > -1) {
      this.tasks = [...this.allTasks.filter((t: TaskType) => t.priority === filter.priority && t.status === filter.status)];
    } else if (filter.priority > -1) {
      this.tasks = [...this.allTasks.filter((t: TaskType) => t.priority === filter.priority)];
    } else if (filter.status > -1) {
      this.tasks = [...this.allTasks.filter((t: TaskType) => t.status === filter.status)];
    } else {
      this.tasks = [...this.allTasks];
    }
  }
}
