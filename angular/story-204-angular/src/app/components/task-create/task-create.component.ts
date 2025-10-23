import { Component, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from '../../interfaces/task-type.interface';

@Component({
  selector: 'task-create',
  imports: [ReactiveFormsModule],
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.css'
})
export class TaskCreate {
  nextId = input<number>(0);
  onCreate = output<TaskType>();

  task = <TaskType>({ id: null, name: '', priority: 0, status: 0 });

  name = new FormControl('');
  priority = new FormControl<number>(0);
  status = new FormControl<number>(0);

  resetTask() {
    this.task.id = null;
    this.task.name = '';
    this.name.setValue('');
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.handleCreateClick();
  }

  handleCreateClick() {
    this.task.id = this.nextId();
    this.task.name = this.name.value || '';
    this.task.priority = this.priority.value || 0;
    this.task.status = this.status.value || 0;
    this.onCreate.emit({ ...this.task });
    this.resetTask();
  }
}
