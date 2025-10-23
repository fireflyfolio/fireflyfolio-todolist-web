import { Component, input, output, effect } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from '../../interfaces/task-type.interface';

@Component({
  selector: 'task-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './task-edit.component.html',
  styleUrl: './task-edit.component.css'
})
export class TaskEdit {
  task = input<TaskType>({ id: null, name: '', priority: 0, status: 0 });
  onUpdate = output<TaskType>();
  onCancel = output();

  name = new FormControl('');
  priority = new FormControl<number>(0);
  status = new FormControl<number>(0);

  constructor() {
    effect(() => {
      this.name.setValue(this.task().name);
      this.priority.setValue(this.task().priority);
      this.status.setValue(this.task().status);
    })
  }

  handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.handleUpdateClick();
    if (e.key === 'Escape') this.handleCancelClick();
  }

  handleUpdateClick() {
    this.onUpdate.emit({
      id: this.task().id,
      name: this.name.value || '',
      priority: this.priority.value || 0,
      status: this.status.value || 0,
    });
  }

  handleCancelClick() {
    this.onCancel.emit();
  }
}
