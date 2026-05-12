<script>
  import { onDestroy } from 'svelte';

  let timeLeft = $state(1500);
  let isRunning = $state(false);

  let interval;

  function startTimer() {
    if (isRunning) return;

    isRunning = true;

    interval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      } else {
        clearInterval(interval);
        isRunning = false;
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(interval);

    timeLeft = 1500;
    isRunning = false;
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<h1>Focus Mode</h1>

<div class="timer-circle">
  <h2>{formatTime(timeLeft)}</h2>
</div>

<div class="timer-buttons">
  <button onclick={startTimer}>
    Start
  </button>

  <button onclick={pauseTimer}>
    Pause
  </button>

  <button onclick={resetTimer}>
    Reset
  </button>
</div>