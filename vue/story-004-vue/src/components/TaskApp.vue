<script setup>
import { ref } from 'vue';

import TaskCreate from './TaskCreate.vue';
import TaskList from './TaskList.vue';

let allTasks = [];
let nextId = ref(0);
let tasks = ref([]);

function refreshAllTasks(t) {
  allTasks = [...t];
}

function handleCreateTask(task) {
  tasks.value = [...tasks.value, task];
  nextId.value++;
  refreshAllTasks(tasks.value);
}

function handleUpdateTask(task) {
  allTasks = allTasks.map((t) => {
    if (t.id === task.id) {
      return task;
    } else {
      return t;
    }
  });

  const _tasks = tasks.value.map(t => {
    if (t.id === task.id) {
      return task;
    } else {
      return t;
    }
  });

  tasks.value = _tasks;
}

function handleDeleteTask(id) {
  const _tasks = [...tasks.value.filter(t => t.id !== id)];
  tasks.value = _tasks;
  refreshAllTasks(_tasks);
}

function handleSort(property) {
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

function handleFilter(priority = -1, status = -1) {
  if (priority > -1 && status > -1) {
    tasks.value = [...allTasks.filter(t => t.priority === priority && t.status === status)];
  } else if (priority > -1) {
    tasks.value = [...allTasks.filter(t => t.priority === priority)];
  } else if (status > -1) {
    tasks.value = [...allTasks.filter(t => t.status === status)];
  } else {
    tasks.value = [...allTasks];
  }
}
</script>

<template>
  <div class="taskapp">
    <TaskCreate :nextId="nextId" @onCreate="handleCreateTask" />
    <TaskList :tasks="tasks" @onUpdate="handleUpdateTask" @onDelete="handleDeleteTask"
      @onSort="handleSort" @onFilter="handleFilter" />
  </div>
</template>

<style scoped>
.taskapp {
  margin: 0;
}
</style>
