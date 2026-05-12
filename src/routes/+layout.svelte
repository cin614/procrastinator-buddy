<script>
  import '../app.css';

  let { children } = $props();
</script>

<main class="app">
  {@render children()}
</main>

<nav class="bottom-nav">
  <a href="/">Home</a>
  <a href="/create-task">Create</a>
  <a href="/focus">Focus</a>
  <a href="/profile">Profile</a>
</nav>