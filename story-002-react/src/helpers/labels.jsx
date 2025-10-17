const STATUS_LABELS = { 0: 'Todo', 1: 'Doing', 2: 'Done' };
const PRIORITY_LABELS = { 0: 'Low', 1: 'Normal', 2: 'High', 3: 'Urgent' };

export const getStatusLabel = (v) => STATUS_LABELS[v] ?? 'Todo';
export const getPriorityLabel = (v) => PRIORITY_LABELS[v] ?? 'Normal';
