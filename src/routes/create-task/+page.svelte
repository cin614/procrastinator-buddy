<script>
  let title = $state("");
  let priority = $state("Medium");
  let deadline = $state("");

  async function createTask() {
    const response = await fetch("/api/tasks", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
        priority,
        deadline,
        completed: false,
        focusSeconds: 0,
      }),
    });

    if (response.ok) {
      alert("Task created successfully!");

      title = "";
      deadline = "";
      priority = "Medium";
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

<div class="form-group">
  <label for="task-deadline">Deadline</label>

  <input id="task-deadline" type="date" bind:value={deadline} />
</div>

<button onclick={createTask}> Create Task </button>
