
<script setup>
import { reactive, useTemplateRef, onMounted, watch } from 'vue'
import { PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels'

const props = defineProps({
  task: { type: Object, required: true } // {id,name,priority,status}
})
const emit = defineEmits(['onSave','onCancel'])

const draft = reactive({
  id: props.task.id,
  name: props.task.name,
  priority: props.task.priority,
  status: props.task.status,
})

watch(()=> props.task, (t)=>{
  draft.id = t.id
  draft.name = t.name
  draft.priority = t.priority
  draft.status = t.status
}, {deep:true})

const inputRef = useTemplateRef('inputRef')
onMounted(()=> inputRef.value?.focus())

function submit(){
  const n = String(draft.name ?? '').trim()
  if (!n) return
  
  emit('onSave', {
    id: draft.id,
    name: n,
    priority: Number(draft.priority) || 0,
    status: Number(draft.status) || 0,
  })
}

function cancel(){ emit('onCancel') }
function onKeydown(e){ if (e.key === 'Escape') cancel() }
</script>

<template>
  <form class="taskedit" @submit.prevent="submit">
    <input ref="inputRef" v-model="draft.name" class="task-input" @keydown="onKeydown" />
    <select v-model.number="draft.priority" aria-label="Edit priority">
      <option v-for="p in PRIORITY_VALUES" :key="p.value" :value="p.value">{{ p.label }}</option>
    </select>
    <select v-model.number="draft.status" aria-label="Edit status">
      <option v-for="s in STATUS_VALUES" :key="s.value" :value="s.value">{{ s.label }}</option>
    </select>
    <button type="submit">Save</button>
    <button type="button" @click="cancel">Cancel</button>
  </form>
</template>

<style scoped>
.taskedit {
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 8px;
  align-items: center;
}
.task-input { width: 100%; padding: 6px 8px; }
</style>
