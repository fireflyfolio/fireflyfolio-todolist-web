import { Component, signal, input, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { TaskType } from '../../interfaces/task-type.interface';
import { FilterType } from '../../interfaces/filter-type.interface';
import { PriorityLabelPipe } from '../../pipes/priority-label.pipe';
import { StatusLabelPipe } from '../../pipes/status-label.pipe';
import { TaskEdit } from '../task-edit/task-edit.component';

@Component({
  selector: 'task-list',
  imports: [ReactiveFormsModule, PriorityLabelPipe, StatusLabelPipe, TaskEdit],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskList {
  tasks = input<TaskType[]>([]);
  onUpdate = output<TaskType>();
  onDelete = output<number | null>();
  onSort= output<string>();
  onFilter = output<FilterType>();

  editId: number | null = null;
  priorityFilter = new FormControl<number>(-1);
  statusFilter = new FormControl<number>(-1);
  sortedTasks = <TaskType[]>[];

  handleEditClick(id: number | null) {
    this.editId = id;
  }

  handleUpdateClick(task: TaskType) {
    this.onUpdate.emit(task);
    this.editId = null;
  }

  handleDeleteClick(id: number | null) {
    this.onDelete.emit(id);
  }

  handleCancelClick() {
    this.editId = null;
  }

  handleSortingClick(property: string) {
    this.onSort.emit(property);
  }

  handleFilter() {
    this.onFilter.emit({
      status: this.statusFilter.value || 0,
      priority: this.priorityFilter.value || 0,
    });
  }
}
