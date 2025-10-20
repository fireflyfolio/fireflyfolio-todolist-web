export type Status = 0 | 1 | 2;
export type Priority = 0 | 1 | 2 | 3;

export const STATUS_LABELS: Record<Status, string> = {
  0: 'Todo',
  1: 'Doing',
  2: 'Done',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  0: 'Low',
  1: 'Normal',
  2: 'High',
  3: 'Urgent',
};

export const getStatusLabel = (v: Status): string =>
  STATUS_LABELS[v] ?? 'Todo';

export const getPriorityLabel = (v: Priority): string =>
  PRIORITY_LABELS[v] ?? 'Normal';

export interface Option {
  value: number;
  label: string;
}

export const STATUS_VALUES: Option[] = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value: Number(value), label })
);

export const PRIORITY_VALUES: Option[] = Object.entries(PRIORITY_LABELS).map(
  ([value, label]) => ({ value: Number(value), label })
);
