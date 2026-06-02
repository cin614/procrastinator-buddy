<script>
  import '../app.css';

  let { children } = $props();
  let darkMode = $state(false);

  function toggleTheme() {
    darkMode = !darkMode;

    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
</script>

<main class="app">
  <button class="theme-toggle" onclick={toggleTheme}>
    {darkMode ? '☀️' : '🌙'}
  </button>

  {@render children()}
</main>

<nav class="bottom-nav">
  <a href="/">
    <span>🏠</span>
    <small>Home</small>
  </a>

  <a href="/create-task">
    <span>➕</span>
    <small>Task</small>
  </a>

  <a href="/focus">
    <span>🎯</span>
    <small>Focus</small>
  </a>

  <a href="/profile">
    <span>👑</span>
    <small>Profile</small>
  </a>
</nav>