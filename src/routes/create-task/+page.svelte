<script>
  let title = $state('');
  let priority = $state('Medium');

  async function createTask() {
    const response = await fetch('/api/tasks', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        title,
        priority,
        completed: false
      })
    });

    if (response.ok) {
      alert('Task created successfully!');

      title = '';
      priority = 'Medium';
    }
  }
</script>

<h1>Create Task</h1>

<div class="form-group">
  <label for="task-title">Task Title</label>

  <input
    id="task-title"
    type="text"
    bind:value={title}
    placeholder="Enter task..."
  />
</div>

<div class="form-group">
  <label for="task-priority">Priority</label>

  <select id="task-priority" bind:value={priority}>
    <option>Low</option>
    <option>Medium</option>
    <option>High</option>
  </select>
</div>

<button onclick={createTask}>
  Create Task
</button>