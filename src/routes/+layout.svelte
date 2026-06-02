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
    {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
  </button>

  {@render children()}
</main>

<nav class="bottom-nav">
  <a href="/">Home</a>
  <a href="/create-task">Create</a>
  <a href="/focus">Focus</a>
  <a href="/profile">Profile</a>
</nav>