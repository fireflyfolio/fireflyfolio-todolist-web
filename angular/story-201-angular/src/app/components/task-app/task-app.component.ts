import { inject, Component, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface TaskType {
  id: number;
  name: string | null;
}

@Component({
  selector: 'task-app',
  imports: [ReactiveFormsModule],
  templateUrl: './task-app.component.html',
  styleUrl: './task-app.component.css'
})
export class TaskApp {
  nextId = 0;

  tasks = <TaskType[]>[];
  task = <TaskType | null>(null);

  inputRef = <ElementRef | null> null;
  name = new FormControl('');

  constructor() {
    this.inputRef = inject(ElementRef);
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.onUpdateClick();
    if (e.key === 'Escape') this.onEditClick();
  }

  onUpdateClick() {
    if (this.task === null) {
      this.tasks.push({
        id: this.nextId,
        name: this.name.value,
      });

      this.nextId++;
    } else {
      const index = this.tasks.findIndex(t => t.id === this.task?.id);
      this.task.name = this.name.value;
      this.tasks.splice(index, 1, this.task);
      this.task = null;
    }

    this.name.setValue('');
  }

  onEditClick(id: number | null = null) {
    if (this.task === null && id !== null) {
      const found = this.tasks.find(t => t.id === id);
      this.task = found || null;
      this.name.setValue(found?.name ?? null);
    } else {
      this.task = null;
      this.name.setValue('');
    }

    this.inputRef?.nativeElement.querySelector('#inputRef')?.focus();
  }

  onDeleteClick(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id)
  }
}
