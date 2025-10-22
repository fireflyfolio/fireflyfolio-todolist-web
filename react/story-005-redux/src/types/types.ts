export type Priority = 0 | 1 | 2 | 3; // Low, Normal, High, Urgent
export type Status   = 0 | 1 | 2;     // Todo, Doing, Done

export interface Task {
  id: number;
  name: string;
  priority: Priority;
  status: Status;
}

export type PartialTaskInput = {
  name: string;
  priority: Priority;
  status: Status;
};

export type PriorityFilter = Priority | -1;
export type StatusFilter = Status | -1;
