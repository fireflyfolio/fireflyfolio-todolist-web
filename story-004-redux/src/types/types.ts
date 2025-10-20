export type Status = 0 | 1 | 2;
export type Priority = 0 | 1 | 2 | 3;

export interface Task {
  id: number;
  name: string;
  priority: Priority;
  status: Status;
}

export type PartialTaskInput = Partial<Omit<Task, 'id'>>;

export type PriorityFilter = Priority | -1;
export type StatusFilter = Status | -1;

export interface TaskListProps {
  tasks: Task[];
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
  onSort: (sorted: Task[]) => void;
  onFilter: (priority?: PriorityFilter, status?: StatusFilter) => void;
  onResetView: () => void;
}

export interface TaskCreateProps {
  nextId: number;
  onCreate: (partial: PartialTaskInput) => void;
  priority?: Priority;
  status?: Status;
}

export interface TaskEditProps {
  tasks: Task[];
  id: number;
  onUpdate: (task: Task) => void;
  onCancel: () => void;
}
