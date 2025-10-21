import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type {
  Task, PartialTaskInput,
  PriorityFilter, StatusFilter
} from '../../types/types';

type SortKey = 'id' | 'name' | 'priority' | 'status';

export interface TasksState {
  all: Task[];              // source de vérité (confirmée)
  view: Task[];             // vue filtrée/triée
  nextId: number;
  filters: { priority: PriorityFilter; status: StatusFilter };
  editingId: number | null; // pour l'édition inline
}

const initialState: TasksState = {
  all: [],
  view: [],
  nextId: 0,
  filters: { priority: -1, status: -1 },
  editingId: null,
};

function applyFilters(all: Task[], priority: PriorityFilter, status: StatusFilter) {
  let base = all;

  if (priority > -1) base = base.filter(t => t.priority === priority);
  if (status > -1)   base = base.filter(t => t.status   === status);

  return base;
}

function sortByKey(list: Task[], key: SortKey): Task[] {
  const sorted = [...list];

  switch (key) {
    case 'id':       sorted.sort((a,b) => a.id-b.id); break;
    case 'name':     sorted.sort((a,b) => a.name.localeCompare(b.name)); break;
    case 'priority': sorted.sort((a,b) => a.priority-b.priority); break;
    case 'status':   sorted.sort((a,b) => a.status-b.status); break;
  }

  return sorted;
}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<PartialTaskInput>) => {
      const task: Task = {
        id: state.nextId++,
        name: action.payload.name.trim(),
        priority: action.payload.priority,
        status: action.payload.status,
      };

      state.all.push(task);
      state.view = applyFilters(state.all, state.filters.priority, state.filters.status);
    },

    updateTask: (state, action: PayloadAction<Task>) => {
      const u = action.payload;
      state.all = state.all.map(t => (t.id === u.id ? u : t));
      state.view = state.view.map(t => (t.id === u.id ? u : t));
      state.editingId = null;
    },

    deleteTask: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.all = state.all.filter(t => t.id !== id);
      state.view = state.view.filter(t => t.id !== id);
    },

    startEdit: (state, action: PayloadAction<number>) => {
      state.editingId = action.payload;
    },

    cancelEdit: (state) => {
      // rollback : on recharge la vue depuis la source + filtres
      state.view = applyFilters(state.all, state.filters.priority, state.filters.status);
      state.editingId = null;
    },

    setPriorityFilter: (state, action: PayloadAction<PriorityFilter>) => {
      state.filters.priority = action.payload;
      state.view = applyFilters(state.all, state.filters.priority, state.filters.status);
    },

    setStatusFilter: (state, action: PayloadAction<StatusFilter>) => {
      state.filters.status = action.payload;
      state.view = applyFilters(state.all, state.filters.priority, state.filters.status);
    },

    resetView: (state) => {
      state.filters = { priority: -1, status: -1 };
      state.view = [...state.all];
    },

    sortView: (state, action: PayloadAction<SortKey>) => {
      state.view = sortByKey(state.view, action.payload);
    },
  },
});

export const {
  createTask, updateTask, deleteTask,
  startEdit, cancelEdit,
  setPriorityFilter, setStatusFilter, resetView,
  sortView,
} = tasksSlice.actions;

export default tasksSlice.reducer;
