<script setup>
import { ref } from 'vue';

import TaskEdit from './TaskEdit.vue';
import { getPriorityLabel, getStatusLabel, PRIORITY_VALUES, STATUS_VALUES} from '@/helpers/labels';

const props = defineProps(['tasks']);
const emit = defineEmits(['onUpdate', 'onDelete', 'onSort', 'onFilter']);

const priorityFilter = ref(-1);
const statusFilter = ref(-1);
const editId = ref(null);

function handleEditClick(id) {
  editId.value = id;
}

function handleUpdateClick(task) {
  emit('onUpdate', task);
  editId.value = null;
}

function handleCancelClick() {
  editId.value = null;
}

function handleFilter() {
  emit('onFilter', priorityFilter.value, statusFilter.value);
}
</script>

<template>
  <div class="tasklist">
    <div class="body">
      <table>
        <thead>
          <tr>
            <th @click="$emit('onSort', 'id')">ID</th>
            <th @click="$emit('onSort', 'name')">Name</th>
            <th @click="$emit('onSort', 'priority')">Priority</th>
            <th @click="$emit('onSort', 'status')">Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="t in props.tasks" :key="t.id">
            <tr v-if="editId === t.id">
              <td colspan="5" class="edit">
                <TaskEdit :tasks="props.tasks" :id="editId" @onUpdate="handleUpdateClick" @onCancel="handleCancelClick" />
              </td>
            </tr>
            <tr v-else>
              <td>{{ t.id }}</td>
              <td>{{ t.name }}</td>
              <td>{{ getPriorityLabel(t.priority) }}</td>
              <td>{{ getStatusLabel(t.status) }}</td>
              <td>
                <button @click="handleEditClick(t.id)">Edit</button>
                <button @click="$emit('onDelete', t.id)">Delete</button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>  
    </div>
    <div class="footer">
      <select v-model="priorityFilter" @change="handleFilter">
        <option :value="-1">All Priorities</option>
        <option v-for="item in PRIORITY_VALUES" :value="item.value">{{ item.label }}</option>
      </select>
      <select v-model="statusFilter" @change="handleFilter">
        <option :value="-1">All Statuses</option>
        <option v-for="item in STATUS_VALUES" :value="item.value">{{ item.label }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.tasklist {
  padding: 10px;
  border: solid 1px #ccc;
}

.body table {
  width: 100%;
  padding: 16px;
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

.body table td.edit {
  padding: 0;
}

.footer {
  margin-top: 32px;
  margin-bottom: 16px;
  text-align: center;
}
</style>
