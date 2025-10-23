<script setup>
import { useTemplateRef, onMounted, ref } from 'vue';

import { getPriorityLabel, getStatusLabel, PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels';

const tasks = ref([]);
const task = ref({ id: null, name: '', priority: 0, status: 0 });
const priorityFilter = ref(-1);
const statusFilter = ref(-1);
const inputRef = useTemplateRef('inputRef');

let nextId = 0;
let allTasks = [];

onMounted(() => {
  inputRef.value.focus();
})

function filterTasks(priority = -1, status = -1) {
  if (priority > -1 && status > -1)
    return allTasks.filter(t => t.priority === priority && t.status === status);
  else if (priority > -1)
    return allTasks.filter(t => t.priority === priority);
  else if (status > -1)
    return allTasks.filter(t => t.status === status);

  return [...allTasks];
}

function resetTask() {
  task.value = { id: null, name: '', priority: 0, status: 0 };
}

function handleKeyDown(e) {
  if (e.key === 'Enter') handleUpdateClick();
  if (e.key === 'Escape') handleEditClick();
}

function handleUpdateClick(e) {
  if (task.value.id === null) {
    const create = { ...task.value, id: nextId++ };
    task.value = create;
    allTasks.push(create);
  } else {
      const index = allTasks.findIndex(t => t.id === task.value.id);
      const update = { ...allTasks[index] };

      update.name = task.value.name;
      update.priority = parseInt(task.value.priority);
      update.status = parseInt(task.value.status); 
      
      allTasks.splice(index, 1, update);    
  }

  tasks.value = [ ...allTasks ];
  resetTask();
}

function handleEditClick(id = null) {
  if (id !== null) {
    task.value = { ...tasks.value.find(t => t.id === id) };
  } else {
      resetTask();
  }

  inputRef.value.focus();
}

function handleDeleteClick(id) {
  allTasks = allTasks.filter(t => t.id !== id);
  tasks.value = [ ...allTasks ];
}

function handleSortingClick(property) {
  switch (property) {
    case 'id':
      tasks.value.sort((a, b) => a.id - b.id);
      break;
    case 'name':
      tasks.value.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'priority':
      tasks.value.sort((a, b) => a.priority - b.priority);
      break;
    case 'status':
      tasks.value.sort((a, b) => a.status - b.status);
      break;
  }
}

function handlePriorityFilter() {
  const priority = parseInt(priorityFilter.value);

  tasks.value = filterTasks(priority, statusFilter.value);
  priorityFilter.value = priority;
}

function handleStatusFilter() {
  const status = parseInt(statusFilter.value);

  tasks.value = filterTasks(priorityFilter.value, status);
  statusFilter.value = status;
}
</script>

<template>
  <div class="TaskApp">
    <div class="header">
      <input class="task" placeholder="Enter a task" ref="inputRef" v-model="task.name" @keydown="handleKeyDown" autofocus />
      <select v-model="task.priority">
        <option v-for="item in PRIORITY_VALUES" :value="item.value">{{ item.label }}</option>
      </select>
      <select v-model="task.status">
        <option v-for="item in STATUS_VALUES" :value="item.value">{{ item.label }}</option>
      </select>      
      <button @click="handleUpdateClick">{{ task.id === null ? 'Create' : 'Update' }}</button>
    </div>
    <div class="body">
      <table>
        <thead>
          <tr>
            <th @click="handleSortingClick('id')">ID</th>
            <th @click="handleSortingClick('name')">Task</th>
            <th @click="handleSortingClick('priority')">Priority</th>
            <th @click="handleSortingClick('status')">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tasks" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ getPriorityLabel(t.priority) }}</td>
            <td>{{ getStatusLabel(t.status) }}</td>
            <td>
              <button @click="handleEditClick(t.id)">{{ task.id === t.id ? 'Cancel' : 'Edit' }}</button>
              <button @click="handleDeleteClick(t.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>  
    </div>
    <div class="footer">
      <select v-model="priorityFilter" @change="handlePriorityFilter">
        <option value="-1">All Priorities</option>
        <option v-for="item in PRIORITY_VALUES" :value="item.value">{{ item.label }}</option>
      </select>
      <select v-model="statusFilter" @change="handleStatusFilter">
        <option value="-1">All Statuses</option>
        <option v-for="item in STATUS_VALUES" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.TaskApp {
  margin: 0;
  padding: 20px;
  border: solid 1px #ccc;
}

.header {
  margin-bottom: 16px;
  text-align: center;
}

.body table {
  padding: 16px;
  width: 100%;
}

.body table th {
  cursor: pointer;
}

.body table th, td {
  padding: 8px;
}

.body table thead {
  background-color: #eee;
}

.footer {
  margin-top: 32px;
  text-align: center;
}

.task {
  display: inline-block;
  width: 250px;
}
</style>
