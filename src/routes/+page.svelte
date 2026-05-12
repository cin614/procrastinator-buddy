<script>
  import { onMount } from 'svelte';

  let tasks = $state([]);
  let xp = $state(0);

  async function loadTasks() {
  const response = await fetch('/api/tasks');

  tasks = await response.json();

  xp = tasks.filter(task => task.completed).length * 30;
}

  onMount(() => {
    loadTasks();
  });

  async function toggleTask(task) {
    task.completed = !task.completed;

    await fetch('/api/tasks/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    loadTasks();
  }

  async function deleteTask(id) {
    await fetch('/api/tasks/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    loadTasks();
  }
</script>

<h1>Procrastinator Buddy</h1>

<div class="xp-box">
  <p>Level 1 - Focus Hero</p>

  <div class="xp-bar">
    <div
      class="xp-fill"
      style={`width: ${Math.min(xp, 300) / 3}%`}
    ></div>
  </div>

  <small>{xp} / 300 XP</small>
</div>

<h2>Open Tasks</h2>

{#each tasks as task}
  {#if !task.completed}
    <div class="task-card">
      <div class="task-card-left">
        <input
          type="checkbox"
          checked={task.completed}
          onchange={() => toggleTask(task)}
        />

        <div>
          <p>{task.title}</p>
          <small>{task.priority}</small>
        </div>
      </div>

      <button
        class="delete-btn"
        onclick={() => deleteTask(task._id)}
      >
        Delete
      </button>
    </div>
  {/if}
{/each}

<h2>Completed</h2>

{#each tasks as task}
  {#if task.completed}
    <div class="task-card completed">
      <div class="task-card-left">
        <input
          type="checkbox"
          checked={task.completed}
          onchange={() => toggleTask(task)}
        />

        <div>
          <p>{task.title}</p>
          <small>{task.priority}</small>
        </div>
      </div>

      <button
        class="delete-btn"
        onclick={() => deleteTask(task._id)}
      >
        Delete
      </button>
    </div>
  {/if}
{/each}