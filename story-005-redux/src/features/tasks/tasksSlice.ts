import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Task } from '../../types/types';

const initialState: Task[] = [];

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<Task>) => {
      state = [...state, {...action.payload}];
    },
    update: (state, action: PayloadAction<Task>) => {
      state = [...state.map(t => t.id === action.payload.id ? action.payload : t)];
    },
    remove: (state, action: PayloadAction<number>) => {
      state = [...state.filter(t => t.id !== action.payload)];
    },
  }
})

export const { create, update, remove } = taskSlice.actions;

export default taskSlice.reducer;
