<script>
  import { onMount } from 'svelte';

  let tasks = $state([]);
  let completedTasks = $state(0);
  let openTasks = $state(0);
  let xp = $state(0);

  async function loadStats() {
    const response = await fetch('/api/tasks');
    tasks = await response.json();

    completedTasks = tasks.filter(task => task.completed).length;
    openTasks = tasks.filter(task => !task.completed).length;
    xp = completedTasks * 30;
  }

  onMount(() => {
    loadStats();
  });
</script>

<h1>Profile</h1>

<div class="profile-card">
  <h2>Focus Hero</h2>
  <p>Level 1</p>

  <div class="xp-bar">
    <div
      class="xp-fill"
      style={`width: ${Math.min(xp, 300) / 3}%`}
    ></div>
  </div>

  <small>{xp} / 300 XP</small>
</div>

<div class="stats-grid">
  <div class="stat-card">
    <h3>{completedTasks}</h3>
    <p>Completed Tasks</p>
  </div>

  <div class="stat-card">
    <h3>{openTasks}</h3>
    <p>Open Tasks</p>
  </div>

  <div class="stat-card">
    <h3>25 min</h3>
    <p>Focus Time</p>
  </div>

  <div class="stat-card">
    <h3>3</h3>
    <p>Streak</p>
  </div>
</div>