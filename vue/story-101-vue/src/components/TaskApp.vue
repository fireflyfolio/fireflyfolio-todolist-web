<script setup>
import { ref, computed, onMounted, nextTick, watch, useTemplateRef } from 'vue'

/* ---- State ---- */
const tasks = ref([])
const editingId = ref(null)        // id de la tâche en cours d'édition (ou null)
const draftName = ref('')          // buffer de saisie
const inputRef = useTemplateRef('inputRef')

/* ---- Utils ---- */
const STORAGE_KEY = 'todolist-web:v1'

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

const isEditing = computed(() => editingId.value !== null)
const isDisabled = computed(() => draftName.value.trim().length === 0)

/* ---- Lifecycle ---- */
onMounted(() => {
  // hydrate from localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) tasks.value = JSON.parse(raw)
  } catch {}

  inputRef.value?.focus()
})

// persist to localStorage
watch(tasks, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
  } catch {}
}, { deep: true })

/* ---- Actions ---- */
function startEdit(id) {
  const t = tasks.value.find(x => x.id === id)
  if (!t) return
  editingId.value = id
  draftName.value = t.name
  nextTick(() => inputRef.value?.focus())
}

function cancelEdit() {
  editingId.value = null
  draftName.value = ''
  nextTick(() => inputRef.value?.focus())
}

function submitForm() {
  const name = draftName.value.trim()
  if (!name) return

  if (!isEditing.value) {
    // create
    const newTask = {
      id: makeId(),
      name,
      status: 'Todo',
      priority: 'Normal',
    }
    tasks.value = [...tasks.value, newTask]
    draftName.value = ''
  } else {
    // update (immutably replace the item)
    tasks.value = tasks.value.map(t => t.id === editingId.value ? { ...t, name } : t)
    cancelEdit()
  }

  nextTick(() => inputRef.value?.focus())
}

function deleteTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
  if (editingId.value === id) {
    // if we deleted the task being edited, reset edit state
    cancelEdit()
  }
}
</script>

<template>
  <div class="TaskApp">
    <form class="head" @submit.prevent="submitForm">
      <label class="sr-only" for="task-input">Task</label>
      <input
        id="task-input"
        class="task"
        placeholder="Enter a task"
        ref="inputRef"
        v-model.trim="draftName"
        @keydown.esc.prevent="isEditing ? cancelEdit() : (draftName = '')"
        autofocus
      />
      <button
        type="submit"
        :disabled="isDisabled"
        :aria-label="isEditing ? 'Update task' : 'Create task'"
      >
        {{ isEditing ? 'Update' : 'Create' }}
      </button>
      <button
        v-if="isEditing"
        type="button"
        @click="cancelEdit"
        aria-label="Cancel editing"
      >
        Cancel
      </button>
    </form>

    <div class="body">
      <ol>
        <li
          v-for="t in tasks"
          :key="t.id"
          :class="['row', { editing: editingId === t.id }]"
        >
          <span class="task-name">{{ t.name }}</span>
          <button type="button" @click="startEdit(t.id)">
            {{ editingId === t.id ? 'Editing…' : 'Edit' }}
          </button>
          <button type="button" @click="deleteTask(t.id)">Delete</button>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.TaskApp {
  margin: 0;
  padding: 20px;
  border: solid 1px #ccc;
  max-width: 520px;
}

.head {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.task {
  display: inline-block;
  width: 280px;
  padding: 8px 10px;
}

.body ol {
  padding-left: 20px;
}

.row {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 6px 0;
}

.row.editing .task-name {
  text-decoration: underline;
}

.task-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Visually hidden but accessible (for the <label>) */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0);
  white-space: nowrap; border: 0;
}
</style>
