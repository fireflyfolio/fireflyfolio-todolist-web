<script setup>
import { ref } from 'vue';
import { PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels';

const props = defineProps(['tasks', 'id']);
const emit = defineEmits(['onUpdate', 'onCancel']);

const task = ref({ ...props.tasks.find(t => t.id === props.id) });

function handleKeyDown(e) {
  if (e.keyCode === 13) handleUpdateClick();
  if (e.keyCode === 27) emit('onCancel');
}

function handleUpdateClick(e) {
  emit('onUpdate', {
    id: task.value.id,
    name: task.value.name,
    priority: task.value.priority,
    status: task.value.status,
  });
}
</script>

<template>
  <div class="taskedit">
    <input placeholder="Enter a task" v-model="task.name" @keydown="handleKeyDown" autofocus />
    <select v-model="task.priority">
      <option v-for="item in PRIORITY_VALUES" :value="item.value">{{ item.label }}</option>
    </select>
    <select v-model="task.status">
      <option v-for="item in STATUS_VALUES" :value="item.value">{{ item.label }}</option>
    </select>      
    <button @click="handleUpdateClick">Update</button>
    <button @click="$emit('onCancel')">Cancel</button>
  </div>
</template>

<style scoped>
.taskedit {
  margin-bottom: 16px;
  padding: 20px;
  border: solid 1px #ccc;
}
</style>
