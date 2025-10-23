import { inject, Component, ElementRef, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface TaskType {
  id: number | null;
  name: string;
}

@Component({
  selector: 'task-app',
  imports: [ReactiveFormsModule],
  templateUrl: './task-app.component.html',
  styleUrl: './task-app.component.css'
})
export class TaskApp {
  nextId = signal(0);
  tasks = signal<TaskType[]>([]);
  task = signal<TaskType>({ id: null, name: '' });

  inputRef = <ElementRef | null> null;
  name = new FormControl('');

  constructor() {
    this.inputRef = inject(ElementRef);
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && this.task().id === null) this.onCreateClick();
    if (e.key === 'Enter' && this.task().id !== null) this.onUpdateClick();
    if (e.key === 'Escape') this.onCancelClick();
  }

  onCreateClick() {
    this.tasks.update(current => [ ...current, {
      id: this.nextId(),
      name: this.name.value || '',
    }]);

    this.nextId.update(v => v + 1);
    this.name.setValue('');
  }

  onUpdateClick() {
    this.tasks.update(current => current.map(t => {
      if (t.id === this.task().id) {
        return {
          id: this.task().id,
          name: this.name.value || '',
        };
      } else {
        return t;
      }
    }));

    this.task.set({ id: null, name: '' });
    this.name.setValue('');
  }

  onEditClick(id: number | null) {
    const found = this.tasks().find(t => t.id === id);

    if (found) {
      this.task.set(found);
      this.name.setValue(found.name);
    }

    this.inputRef?.nativeElement.querySelector('#inputRef')?.focus();
  }

  onCancelClick() {
    this.task.set({ id: null, name: '' });
    this.name.setValue('');
  }

  onDeleteClick(id: number | null) {
    this.tasks.update(current => [ ...current.filter(t => t.id !== id) ]);
  }
}
