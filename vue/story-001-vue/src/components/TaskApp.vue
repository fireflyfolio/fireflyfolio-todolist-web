<script setup>
import { useTemplateRef, onMounted, ref } from 'vue'

const tasks = ref([])
const task = ref(null)
const name = ref('')
const inputRef = useTemplateRef('inputRef')

let nextId = 0

onMounted(() => {
  inputRef.value.focus()
})

function handleKeyDown(e) {
  if (e.key === 'Enter') handleUpdateClick()
  if (e.key === 'Escape') handleEditClick()
}

function handleUpdateClick(e) {
  if (task.value === null) {
    const newTask = {
        id: nextId++,
        name: name.value.trim(),
        status: 'Todo',
        priority: 'Normal',
      }
    tasks.value = [...tasks.value, newTask]
  } else { 
    const index = tasks.value.findIndex(t => t.id == task.value.id)
    task.value.name = name.value        
    tasks.value.splice(index, 1, task.value)       
    task.value = null
  }

  name.value = ''
}

function handleEditClick(id = null) {
  if (task.value === null && id !== null) {
    const found = tasks.value.find(t => t.id == id)
    task.value = found
    name.value = found?.name ?? null
  } else {
    task.value = null
    name.value = ''
  }

  inputRef.value.focus();
}

function handleDeleteClick(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}
</script>

<template>
  <div class="TaskApp">
    <div class="head">
      <input class="task" placeholder="Enter a task" ref="inputRef" v-model="name" @keydown="handleKeyDown" autofocus />
      <button @click="handleUpdateClick">{{ task === null ? 'Create' : 'Update' }}</button>
    </div>
    <div class="body">
      <ol>
        <li v-for="t in tasks" :key="t.id">
          <span class="task">{{ t.name }}</span>
          <button @click="handleEditClick(t.id)">{{ task?.id === t.id ? 'Cancel' : 'Edit' }}</button>
          <button @click="handleDeleteClick(t.id)">Delete</button>
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
}

.head {
  text-align: center;
}

.task {
  display: inline-block;
  width: 250px;
}
</style>
