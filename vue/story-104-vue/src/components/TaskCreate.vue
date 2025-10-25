
<script setup>
import { ref, useTemplateRef, onMounted } from 'vue'
import { PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels'

const props = defineProps({
  nextId: { type: Number, required: true },
})

const emit = defineEmits(['onCreate'])

const name = ref('')
const priority = ref(0)
const status = ref(0)

const inputRef = useTemplateRef('inputRef')

onMounted(()=> inputRef.value?.focus())

function reset(){
  name.value = ''
  priority.value = 0
  status.value = 0
}

function onKeydown(e){
  if (e.key === 'Escape') reset()
}

function submit(){
  const n = name.value.trim()
  if (!n) return
  emit('onCreate', {
    id: props.nextId,
    name: n,
    priority: Number(priority.value) || 0,
    status: Number(status.value) || 0,
  })
  reset()
  queueMicrotask(()=> inputRef.value?.focus())
}
</script>

<template>
  <form class="taskcreate" @submit.prevent="submit">
    <input
      ref="inputRef"
      class="task-input"
      placeholder="Enter a task"
      v-model="name"
      @keydown="onKeydown"
      autofocus
    />
    <select v-model.number="priority" aria-label="Select priority">
      <option v-for="p in PRIORITY_VALUES" :key="p.value" :value="p.value">{{ p.label }}</option>
    </select>
    <select v-model.number="status" aria-label="Select status">
      <option v-for="s in STATUS_VALUES" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>
    <button type="submit" :disabled="!name.trim()">Create</button>
    <button type="button" @click="reset">Reset</button>
  </form>
</template>

<style scoped>
.taskcreate {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 8px;
  align-items: center;
  margin-bottom: 16px;
}
.task-input { max-width: 320px; width: 100%; padding: 8px 10px; }
</style>
