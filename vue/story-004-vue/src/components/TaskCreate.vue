<script setup>
import { ref } from 'vue';
import { PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels';

const props = defineProps(['nextId']);
const emit = defineEmits(['onCreate']);

const defaultTask = { id: null, name: '', priority: 0, status: 0 };
const task = ref(defaultTask);

function resetTask() {
  defaultTask.name = '';
  defaultTask.priority = task.value.priority;
  defaultTask.status = task.value.status;
  task.value = { ...defaultTask };
}

function handleKeyDown(e) {
  if (e.key === 'Enter') handleCreateClick();
}

function handleCreateClick(e) {
  emit('onCreate', { ...task.value, id: props.nextId });
  resetTask();
}
</script>

<template>
  <div class="taskcreate">
    <input placeholder="Enter a task" v-model="task.name" @keydown="handleKeyDown" autofocus />
    <select v-model="task.priority">
      <option v-for="item in PRIORITY_VALUES" :value="item.value">{{ item.label }}</option>
    </select>
    <select v-model="task.status">
      <option v-for="item in STATUS_VALUES" :value="item.value">{{ item.label }}</option>
    </select>      
    <button @click="handleCreateClick">Create</button>
  </div>
</template>

<style scoped>
.taskcreate {
  margin-bottom: 16px;
  padding: 20px;
  border: solid 1px #ccc;
  text-align: center;
}
</style>
