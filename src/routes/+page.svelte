<script>
  import { onMount } from "svelte";

  let tasks = $state([]);
  let xp = $state(0);
  let editDeadline = $state("");
  let showCompleteAnimation = $state(false);
  let priorityFilter = $state("All");
  let sortBy = $state("default");

  function getLevel() {
    if (xp >= 1000)
      return {
        level: 4,
        title: "Procrastination Master",
      };

    if (xp >= 600)
      return {
        level: 3,
        title: "Task Slayer",
      };

    if (xp >= 300)
      return {
        level: 2,
        title: "Productivity Warrior",
      };

    return {
      level: 1,
      title: "Focus Hero",
    };
  }
  function getLevelProgress() {
    if (xp >= 1000) {
      return {
        current: xp - 1000,
        needed: 500,
      };
    }

    if (xp >= 600) {
      return {
        current: xp - 600,
        needed: 400,
      };
    }

    if (xp >= 300) {
      return {
        current: xp - 300,
        needed: 300,
      };
    }

    return {
      current: xp,
      needed: 300,
    };
  }

  let editingTaskId = $state(null);
  let editTitle = $state("");
  let editPriority = $state("Medium");

  function calculateXp(tasks) {
    return tasks
      .filter((task) => task.completed)
      .reduce((total, task) => {
        if (task.priority === "High") return total + 50;
        if (task.priority === "Medium") return total + 30;
        if (task.priority === "Low") return total + 10;

        return total;
      }, 0);
  }

  function getVisibleTasks(completedStatus) {
    let visibleTasks = tasks.filter(
      (task) => task.completed === completedStatus,
    );

    if (priorityFilter !== "All") {
      visibleTasks = visibleTasks.filter(
        (task) => task.priority === priorityFilter,
      );
    }

    if (sortBy === "deadline") {
      visibleTasks = [...visibleTasks].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;

        return new Date(a.deadline) - new Date(b.deadline);
      });
    }

    return visibleTasks;
  }

  async function loadTasks() {
    const response = await fetch("/api/tasks");
    tasks = await response.json();
    xp = calculateXp(tasks);
  }

  onMount(() => {
    loadTasks();
  });

  async function toggleTask(task) {
    task.completed = !task.completed;

    if (task.completed) {
      showCompleteAnimation = true;

      setTimeout(() => {
        showCompleteAnimation = false;
      }, 1500);
    }

    await fetch("/api/tasks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    loadTasks();
  }

  async function deleteTask(id) {
    await fetch("/api/tasks/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadTasks();
  }

  function startEdit(task) {
    editingTaskId = task._id;
    editTitle = task.title;
    editPriority = task.priority;
    editDeadline = task.deadline || "";
  }

  function cancelEdit() {
    editingTaskId = null;
    editTitle = "";
    editPriority = "Medium";
    editDeadline = "";
  }

  async function saveEdit(task) {
    await fetch("/api/tasks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        title: editTitle,
        priority: editPriority,
        deadline: editDeadline,
      }),
    });

    cancelEdit();
    loadTasks();
  }
</script>

<h1>Procrastinator Buddy</h1>

{#if showCompleteAnimation}
  <div class="complete-animation">🎉 Task completed!</div>
{/if}

<div class="xp-box">
  <p>
    Level {getLevel().level}
    -
    {getLevel().title}
  </p>

  <div class="xp-bar">
    <div
      class="xp-fill"
      style={`width: ${(getLevelProgress().current / getLevelProgress().needed) * 100}%`}
    ></div>
  </div>

  <small>
    {getLevelProgress().current} / {getLevelProgress().needed} XP
  </small>
</div>

<div class="filter-box">
  <div class="form-group">
    <label for="priority-filter">Filter by Priority</label>

    <select id="priority-filter" bind:value={priorityFilter}>
      <option>All</option>
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
  </div>

  <div class="form-group">
    <label for="sort-by">Sort by</label>

    <select id="sort-by" bind:value={sortBy}>
      <option value="default">Default</option>
      <option value="deadline">Deadline</option>
    </select>
  </div>
</div>

<h2>Open Tasks</h2>

{#each getVisibleTasks(false) as task}
  <div class="task-card">
    <div class="task-card-left">
      <input
        type="checkbox"
        checked={task.completed}
        onchange={() => toggleTask(task)}
      />

      <div>
        <p>{task.title}</p>

        <small class={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </small>

        {#if task.deadline}
          <small class="deadline">
            Deadline: {task.deadline}
          </small>
        {/if}
      </div>
    </div>

    <div class="task-actions">
      <button class="edit-btn" onclick={() => startEdit(task)}>Edit</button>

      <button class="delete-btn" onclick={() => deleteTask(task._id)}>
        Delete
      </button>
    </div>
  </div>

  {#if editingTaskId === task._id}
    <div class="edit-form">
      <input type="text" bind:value={editTitle} placeholder="Task title" />

      <select bind:value={editPriority}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input type="date" bind:value={editDeadline} />

      <div class="edit-buttons">
        <button onclick={() => saveEdit(task)}>Save</button>
        <button class="cancel-btn" onclick={cancelEdit}>Cancel</button>
      </div>
    </div>
  {/if}
{/each}

<h2>Completed</h2>

{#each getVisibleTasks(true) as task}
  <div class="task-card completed">
    <div class="task-card-left">
      <input
        type="checkbox"
        checked={task.completed}
        onchange={() => toggleTask(task)}
      />

      <div>
        <p>{task.title}</p>

        <small class={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </small>
      </div>
    </div>
  </div>
{/each}
