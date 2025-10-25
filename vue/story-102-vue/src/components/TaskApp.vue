<script>
export default {
  name: 'TaskApp',

  data() {
    return {
      tasks: [],
      editingId: null,     // id en cours d'édition (ou null)
      draftName: '',       // buffer de saisie
      STORAGE_KEY: 'todolist-web:v1',
    }
  },

  computed: {
    isEditing() {
      return this.editingId !== null
    },
    isDisabled() {
      return this.draftName.trim().length === 0
    },
  },

  created() {
    // hydratation depuis localStorage
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      if (raw) this.tasks = JSON.parse(raw)
    } catch {}
  },

  mounted() {
    this.$refs.inputRef?.focus()
  },

  watch: {
    // persistance automatique
    tasks: {
      deep: true,
      handler(val) {
        try {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(val))
        } catch {}
      },
    },
  },

  methods: {
    makeId() {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
      return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
    },

    startEdit(id) {
      const t = this.tasks.find(x => x.id === id)
      if (!t) return
      this.editingId = id
      this.draftName = t.name
      this.$nextTick(() => this.$refs.inputRef?.focus())
    },

    cancelEdit() {
      this.editingId = null
      this.draftName = ''
      this.$nextTick(() => this.$refs.inputRef?.focus())
    },

    submitForm() {
      const name = this.draftName.trim()
      if (!name) return

      if (!this.isEditing) {
        // création
        const newTask = {
          id: this.makeId(),
          name,
          status: 'Todo',
          priority: 'Normal',
        }
        this.tasks = [...this.tasks, newTask]
        this.draftName = ''
      } else {
        // mise à jour (remplacement immuable)
        const id = this.editingId
        this.tasks = this.tasks.map(t => (t.id === id ? { ...t, name } : t))
        this.cancelEdit()
      }

      this.$nextTick(() => this.$refs.inputRef?.focus())
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(t => t.id !== id)
      if (this.editingId === id) this.cancelEdit()
    },

    onKeydown(e) {
      if (e.key === 'Escape') {
        if (this.isEditing) this.cancelEdit()
        else this.draftName = ''
      }
    },
  },
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
        @keydown="onKeydown"
        :aria-label="isEditing ? 'Edit task name' : 'New task name'"
        autofocus
      />
      <button type="submit" :disabled="isDisabled" :aria-label="isEditing ? 'Update task' : 'Create task'">
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
        <li v-for="t in tasks" :key="t.id" :class="['row', { editing: editingId === t.id }]">
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
