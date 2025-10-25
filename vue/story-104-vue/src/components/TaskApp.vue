
<script setup>
import { ref, onMounted, watch } from 'vue'
import TaskCreate from './TaskCreate.vue'
import TaskList from './TaskList.vue'

const STORAGE_KEY = 'taskapp:v3'

// source of truth
const allTasks = ref([])   // full dataset (unfiltered)
const tasks = ref([])      // current view (filtered/sorted)
const nextId = ref(0)

// sort state (handled in App to keep List dumb)
const sortBy = ref('id')     // 'id' | 'name' | 'priority' | 'status'
const sortDir = ref('asc')   // 'asc' | 'desc'

function applySort(list){
  const col = sortBy.value
  const dir = sortDir.value === 'asc' ? 1 : -1
  const arr = [...list]

  arr.sort((a,b)=>{
    if (col === 'name') return a.name.localeCompare(b.name) * dir
    return (Number(a[col]) - Number(b[col])) * dir
  })
  
  return arr
}

function refreshAllTasks(t) {
  allTasks.value = [...t]
}

function hydrateFromStorage(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) return
    const parsed = JSON.parse(raw)

    if (Array.isArray(parsed)) {
      allTasks.value = parsed
      tasks.value = applySort(parsed)
      // reset nextId to max+1 if using numeric ids
      const maxId = parsed.reduce((m,t)=> Math.max(m, Number.isFinite(+t.id)? +t.id : -1), -1)
      nextId.value = isFinite(maxId) && maxId >= 0 ? maxId + 1 : 0
    }
  } catch {}
}

onMounted(()=>{
  hydrateFromStorage()
})

watch(allTasks, (val)=>{
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(val)) } catch {}
}, {deep:true})

/* ---- Handlers from children ---- */
function handleCreateTask(task) {
  const merged = [...allTasks.value, task]
  refreshAllTasks(merged)
  tasks.value = applySort(merged)
  nextId.value++
}

function handleUpdateTask(task) {
  const updatedAll = allTasks.value.map(t => t.id === task.id ? task : t)
  refreshAllTasks(updatedAll)
  // also update current view
  const updatedView = tasks.value.map(t => t.id === task.id ? task : t)
  tasks.value = applySort(updatedView)
}

function handleDeleteTask(id) {
  const updated = allTasks.value.filter(t => t.id !== id)
  refreshAllTasks(updated)
  tasks.value = applySort(updated)
}

function handleSort(column) {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = column
    sortDir.value = 'asc'
  }
  tasks.value = applySort(tasks.value)
}

function handleFilter(priority = -1, status = -1) {
  let base = [...allTasks.value]
  if (priority > -1) base = base.filter(t => Number(t.priority) === Number(priority))
  if (status > -1) base = base.filter(t => Number(t.status) === Number(status))
  tasks.value = applySort(base)
}
</script>

<template>
  <div class="taskapp">
    <TaskCreate :nextId="nextId" @onCreate="handleCreateTask" />
    <TaskList
      :tasks="tasks"
      @onUpdate="handleUpdateTask"
      @onDelete="handleDeleteTask"
      @onSort="handleSort"
      @onFilter="handleFilter"
    />
  </div>
</template>

<style scoped>
.taskapp {
  margin: 0;
}
</style>
