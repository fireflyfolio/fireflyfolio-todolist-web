import { inject, Component, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from '../../interfaces/task-type.interface';
import { PriorityLabelPipe } from '../../pipes/priority-label.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';

@Component({
  selector: 'task-app',
  imports: [ReactiveFormsModule, PriorityLabelPipe, StatusLabelPipe],
  templateUrl: './task-app.component.html',
  styleUrl: './task-app.component.css'
})
export class TaskApp {
  nextId = 0;
  allTasks = <TaskType[]>[];

  tasks = <TaskType[]>[];
  task = <TaskType>({id: null, name: '', priority: 0, status: 0});

  inputRef = <ElementRef | null> null;
  name = new FormControl('');
  priority = new FormControl<number>(0);
  status = new FormControl<number>(0);

  priorityFilter = new FormControl<number>(-1);
  statusFilter = new FormControl<number>(-1);

  constructor() {
    this.inputRef = inject(ElementRef);
  }

  filterTasks(priority: number | null = -1, status: number | null = -1) {
    if (priority !== null && priority > -1 && status !== null && status > -1)
      return this.allTasks.filter(t => t.priority === priority && t.status === status);
    else if (priority !== null && priority > -1)
      return this.allTasks.filter(t => t.priority === priority);
    else if (status !== null && status > -1)
      return this.allTasks.filter(t => t.status === status);

    return [...this.allTasks];
  }

  resetTask() {
    this.task = {id: null, name: '', priority: 0, status: 0};
    this.name.setValue('');
    this.priority.setValue(0);
    this.status.setValue(0);
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.onUpdateClick();
    if (e.key === 'Escape') this.onEditClick();
  }

  onUpdateClick() {
    if (this.task.id === null) {
      const create: TaskType = {
        id: this.nextId,
        name: this.name.value || '',
        priority: this.priority.value || 0,
        status: this.status.value || 0,
      };

      this.task = create;
      this.allTasks.push(create);
      this.nextId++;
    } else {
      const index: number = this.tasks.findIndex(t => t.id == this.task.id);

      const update: TaskType = {
        id: this.task.id,
        name: this.name.value || '',
        priority: this.priority.value || 0,
        status: this.status.value || 0,
      };

      this.allTasks.splice(index, 1, update);
    }

    this.tasks = [...this.allTasks];
    this.resetTask();
  }

  onEditClick(id: number | null = null) {
    if (this.task.id === null && id !== null) {
      const found = this.tasks.find(t => t.id === id);
      this.task = found || {id: null, name: '', priority: 0, status: 0};
      this.name.setValue(found?.name || this.task.name);
      this.priority.setValue(found?.priority || this.task.priority);
      this.status.setValue(found?.status || this.task.priority);
    } else {
      this.resetTask();
    }

    this.inputRef?.nativeElement.querySelector('#inputRef')?.focus();
  }

  onDeleteClick(id: number | null) {
    this.allTasks = this.allTasks.filter(t => t.id !== id);
    this.tasks = [...this.allTasks];
  }

  onSortingClick(property: string) {
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

  onPriorityFilter() {
    const priority = this.priorityFilter.value;

    this.tasks = this.filterTasks(priority, this.statusFilter.value);
    this.priorityFilter.setValue(priority);
  }

  onStatusFilter() {
    const status = this.statusFilter.value;

    this.tasks = this.filterTasks(this.priorityFilter.value, status);
    this.statusFilter.setValue(status);
  }
}
