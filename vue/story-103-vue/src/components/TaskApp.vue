<script setup>
import { ref, computed, onMounted, watch, useTemplateRef } from 'vue'
import { getPriorityLabel, getStatusLabel, PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels'

/* ---- State ---- */
const tasks = ref([]) // single source of truth
const draft = ref({ id: null, name: '', priority: 0, status: 0 }) // buffer d'édition/création

const priorityFilter = ref(-1)
const statusFilter = ref(-1)

const sortBy = ref('id')    // 'id' | 'name' | 'priority' | 'status'
const sortDir = ref('asc')  // 'asc' | 'desc'

const inputRef = useTemplateRef('inputRef')
const STORAGE_KEY = 'todolist-web:v2'

/* ---- Lifecycle ---- */
onMounted(() => {
  // hydrate
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) tasks.value = JSON.parse(raw)
  } catch {}
  inputRef.value?.focus()
})

// persist
watch(tasks, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  } catch {}
}, { deep: true })

/* ---- Helpers ---- */
function makeId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

const isEditing = computed(() => draft.value.id !== null)
const isDisabled = computed(() => draft.value.name.trim().length === 0)

/* ---- Derived lists (filters + sort) ---- */
const filtered = computed(() => {
  const p = priorityFilter.value
  const s = statusFilter.value
  if (p > -1 && s > -1) return tasks.value.filter(t => t.priority === p && t.status === s)
  if (p > -1) return tasks.value.filter(t => t.priority === p)
  if (s > -1) return tasks.value.filter(t => t.status === s)
  return tasks.value
})

const visibleTasks = computed(() => {
  const col = sortBy.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  const arr = [...filtered.value]
  arr.sort((a, b) => {
    if (col === 'name') return a.name.localeCompare(b.name) * dir
    return (a[col] - b[col]) * dir // id, priority, status sont numériques
  })
  return arr
})

/* ---- Actions ---- */
function resetDraft() {
  draft.value = { id: null, name: '', priority: 0, status: 0 }
}

function submitForm() {
  const name = draft.value.name.trim()
  if (!name) return

  if (!isEditing.value) {
    // create
    tasks.value = [
      ...tasks.value,
      {
        id: makeId(),
        name,
        priority: Number(draft.value.priority) || 0,
        status: Number(draft.value.status) || 0,
      },
    ]
    resetDraft()
  } else {
    // update (immutably)
    const id = draft.value.id
    tasks.value = tasks.value.map(t =>
      t.id === id
        ? {
            ...t,
            name,
            priority: Number(draft.value.priority) || 0,
            status: Number(draft.value.status) || 0,
          }
        : t
    )
    resetDraft()
  }

  // restore focus
  queueMicrotask(() => inputRef.value?.focus())
}

function startEdit(id) {
  const t = tasks.value.find(x => x.id === id)
  if (!t) return
  draft.value = { ...t }
  queueMicrotask(() => inputRef.value?.focus())
}

function cancelEdit() {
  resetDraft()
  queueMicrotask(() => inputRef.value?.focus())
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
  if (draft.value.id === id) resetDraft()
}

function toggleSort(column) {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDir.value = 'asc'
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (isEditing.value) cancelEdit()
    else draft.value.name = ''
  }
}
</script>

<template>
  <div class="TaskApp">
    <form class="header" @submit.prevent="submitForm">
      <input
        class="task"
        placeholder="Enter a task"
        ref="inputRef"
        v-model="draft.name"
        @keydown="onKeydown"
        :aria-label="isEditing ? 'Edit task name' : 'New task name'"
        autofocus
      />
      <select v-model.number="draft.priority" aria-label="Select priority">
        <option v-for="item in PRIORITY_VALUES" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <select v-model.number="draft.status" aria-label="Select status">
        <option v-for="item in STATUS_VALUES" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <button type="submit" :disabled="isDisabled">
        {{ isEditing ? 'Update' : 'Create' }}
      </button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Cancel</button>
    </form>

    <div class="body">
      <table>
        <thead>
          <tr>
            <th @click="toggleSort('id')">ID</th>
            <th @click="toggleSort('name')">Task</th>
            <th @click="toggleSort('priority')">Priority</th>
            <th @click="toggleSort('status')">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in visibleTasks" :key="t.id">
            <td>{{ t.id }}</td>
            <td>{{ t.name }}</td>
            <td>{{ getPriorityLabel(t.priority) }}</td>
            <td>{{ getStatusLabel(t.status) }}</td>
            <td>
              <button @click="startEdit(t.id)">{{ draft.id === t.id ? 'Cancel' : 'Edit' }}</button>
              <button @click="deleteTask(t.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer">
      <select v-model.number="priorityFilter" aria-label="Filter by priority">
        <option :value="-1">All Priorities</option>
        <option v-for="item in PRIORITY_VALUES" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <select v-model.number="statusFilter" aria-label="Filter by status">
        <option :value="-1">All Statuses</option>
        <option v-for="item in STATUS_VALUES" :key="item.value" :value="item.value">{{ item.label }}</option>
      </select>
      <span class="sort-hint">Sorted by {{ sortBy }} ({{ sortDir }})</span>
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
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 8px;
  align-items: center;
}

.body table {
  padding: 16px;
  width: 100%;
  border-collapse: collapse;
}

.body table th {
  cursor: pointer;
  user-select: none;
}

.body table th,
.body table td {
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.body table thead {
  background-color: #eee;
}

.footer {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.task {
  display: inline-block;
  width: 100%;
  max-width: 280px;
  padding: 8px 10px;
}

.sort-hint {
  color: #666;
  font-size: 12px;
}
</style>
