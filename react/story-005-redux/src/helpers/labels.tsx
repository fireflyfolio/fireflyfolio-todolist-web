import type { Priority, Status } from '../types/types';

export const PRIORITY_VALUES: { value: Priority; label: string }[] = [
  { value: 0, label: 'Low' },
  { value: 1, label: 'Normal' },
  { value: 2, label: 'High' },
  { value: 3, label: 'Urgent' },
];

export const STATUS_VALUES: { value: Status; label: string }[] = [
  { value: 0, label: 'Todo' },
  { value: 1, label: 'Doing' },
  { value: 2, label: 'Done' },
];

export const getPriorityLabel = (v: Priority) =>
  PRIORITY_VALUES.find(p => p.value === v)?.label ?? 'Normal';

export const getStatusLabel = (v: Status) =>
  STATUS_VALUES.find(s => s.value === v)?.label ?? 'Todo';
