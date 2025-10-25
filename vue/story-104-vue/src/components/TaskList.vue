
<script setup>
import { ref, computed } from 'vue'
import TaskEdit from './TaskEdit.vue'
import { getPriorityLabel, getStatusLabel, PRIORITY_VALUES, STATUS_VALUES } from '@/helpers/labels'

const props = defineProps({
  tasks: { type: Array, required: true }
})
const emit = defineEmits(['onUpdate','onDelete','onSort','onFilter'])

const editingId = ref(null)
const priorityFilter = ref(-1)
const statusFilter = ref(-1)

const byId = computed(()=>{
  const m = new Map()
  for (const t of props.tasks) m.set(t.id, t)
  return m
})

function startEdit(id){ editingId.value = id }
function cancelEdit(){ editingId.value = null }
function saveEdit(task){ emit('onUpdate', task); editingId.value = null }
function deleteRow(id){ if (editingId.value === id) editingId.value = null; emit('onDelete', id) }

function sortBy(col){ emit('onSort', col) }
function applyFilters(){ emit('onFilter', Number(priorityFilter.value), Number(statusFilter.value)) }
</script>

<template>
  <div class="tasklist">
    <div class="filters">
      <select v-model.number="priorityFilter" @change="applyFilters" aria-label="Filter by priority">
        <option :value="-1">All Priorities</option>
        <option v-for="p in PRIORITY_VALUES" :key="p.value" :value="p.value">{{ p.label }}</option>
      </select>
      <select v-model.number="statusFilter" @change="applyFilters" aria-label="Filter by status">
        <option :value="-1">All Statuses</option>
        <option v-for="s in STATUS_VALUES" :key="s.value" :value="s.value">{{ s.label }}</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">ID</th>
          <th @click="sortBy('name')">Task</th>
          <th @click="sortBy('priority')">Priority</th>
          <th @click="sortBy('status')">Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in props.tasks" :key="t.id">
          <td>{{ t.id }}</td>

          <td v-if="editingId !== t.id">{{ t.name }}</td>
          <td v-else colspan="3" class="edit-cell">
            <TaskEdit :task="byId.get(t.id)" @onSave="saveEdit" @onCancel="cancelEdit" />
          </td>

          <template v-if="editingId !== t.id">
            <td>{{ getPriorityLabel(t.priority) }}</td>
            <td>{{ getStatusLabel(t.status) }}</td>
          </template>

          <td class="actions">
            <button v-if="editingId !== t.id" @click="startEdit(t.id)">Edit</button>
            <button v-else @click="cancelEdit">Cancel</button>
            <button @click="deleteRow(t.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.tasklist { margin-top: 8px; }
.filters {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
table { width: 100%; border-collapse: collapse; }
thead { background: #eee; }
th, td { padding: 8px; border-bottom: 1px solid #eee; }
th { cursor: pointer; user-select: none; }
.actions { white-space: nowrap; }
.edit-cell { padding: 0; }
</style>
