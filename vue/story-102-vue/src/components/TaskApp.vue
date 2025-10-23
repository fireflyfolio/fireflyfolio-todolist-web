<script>
export default {
  data() {
    return {
      tasks: [],
      task: null,
      name: '',
      nextId: 0,   
    }
  },
  mounted() {
    this.$refs.inputRef.focus()
  },
  methods: {
    handleKeyDown(e) {
      if (e.key === 'Enter') this.handleUpdateClick()
      if (e.key === 'Escape') this.handleEditClick()
    },
    handleUpdateClick(e) {
      if (this.task === null) {
        this.tasks.push({
          id: this.nextId++,
          name: this.name,
          status: 'Todo',
          priority: 'Normal',
        })
      } else { 
        const index = this.tasks.findIndex(t => t.id == this.task.id);
        this.task.name = this.name     
        this.tasks.splice(index, 1, this.task)     
        this.task = null
      }

      this.name = ''
    },
    handleEditClick(id = null) {
      if (this.task === null && id !== null) {
        const found = this.tasks.find(t => t.id == id)
        this.task = found
        this.name = found?.name ?? null
      } else {
        this.task = null
        this.name = ''
      }

      this.$refs.inputRef.focus();
    },
    handleDeleteClick(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
    },
  },
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
