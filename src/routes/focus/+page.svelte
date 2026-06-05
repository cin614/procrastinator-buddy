<script>
  import { onMount, onDestroy } from "svelte";

  let tasks = $state([]);
  let selectedTaskId = $state("");

  let mode = $state("pomodoro");
  let customMinutes = $state(30);

  let timeLeft = $state(1500);
  let elapsedTime = $state(0);
  let isRunning = $state(false);
  let message = $state("");

  let interval;

  async function loadTasks() {
    const response = await fetch("/api/tasks");
    const allTasks = await response.json();

    tasks = allTasks.filter((task) => !task.completed);
  }

  onMount(() => {
    loadTasks();
    setModeTime();
  });

  function setModeTime() {
    clearInterval(interval);
    interval = null;

    isRunning = false;
    message = "";
    elapsedTime = 0;

    if (mode === "pomodoro") {
      timeLeft = 25 * 60;
    } else if (mode === "long") {
      timeLeft = 52 * 60;
    } else if (mode === "sprint") {
      timeLeft = 15 * 60;
    } else if (mode === "custom") {
      timeLeft = Number(customMinutes) * 60;
    } else if (mode === "stopwatch") {
      timeLeft = 0;
    }
  }

  function getTotalTime() {
    if (mode === "pomodoro") return 25 * 60;
    if (mode === "long") return 52 * 60;
    if (mode === "sprint") return 15 * 60;
    if (mode === "custom") return Number(customMinutes) * 60;

    return 1;
  }

  function getProgress() {
    if (mode === "stopwatch") return 100;

    return (timeLeft / getTotalTime()) * 100;
  }

  async function saveFocusSession(durationSeconds) {
    await fetch("/api/focus-sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode,
        durationSeconds,
        taskId: selectedTaskId || null,
      }),
    });
  }

  async function addFocusTimeToTask(durationSeconds) {
    if (!selectedTaskId) return;

    const task = tasks.find((task) => task._id === selectedTaskId);

    if (!task) return;

    const currentFocusSeconds = task.focusSeconds || 0;

    await fetch("/api/tasks/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...task,
        focusSeconds: currentFocusSeconds + durationSeconds,
      }),
    });

    loadTasks();
  }

  function startTimer() {
    if (isRunning) return;

    message = "";
    isRunning = true;

    interval = setInterval(async () => {
      if (mode === "stopwatch") {
        elapsedTime++;
        return;
      }

      if (timeLeft > 0) {
        timeLeft--;
      } else {
        clearInterval(interval);
        interval = null;
        isRunning = false;
        await saveFocusSession(getTotalTime());
        await addFocusTimeToTask(getTotalTime());

        message =
          "Focus session completed and saved! 🎉 Focus time was added to the task.";
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(interval);
    interval = null;
    isRunning = false;
  }

  function resetTimer() {
    clearInterval(interval);
    interval = null;

    isRunning = false;
    message = "";
    elapsedTime = 0;

    if (mode === "pomodoro") {
      timeLeft = 25 * 60;
    } else if (mode === "long") {
      timeLeft = 52 * 60;
    } else if (mode === "sprint") {
      timeLeft = 15 * 60;
    } else if (mode === "custom") {
      timeLeft = Number(customMinutes) * 60;
    } else if (mode === "stopwatch") {
      timeLeft = 0;
    }
  }

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (mode === "stopwatch") {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<h1>Focus Mode</h1>

<div class="form-group">
  <label for="focus-task">Optional: Focus on Task</label>

  <select id="focus-task" bind:value={selectedTaskId} disabled={isRunning}>
    <option value="">No specific task</option>

    {#each tasks as task}
      <option value={task._id}>
        {task.title} ({task.priority})
      </option>
    {/each}
  </select>
</div>

<div class="form-group">
  <label for="focus-mode">Focus Mode</label>

  <select
    id="focus-mode"
    bind:value={mode}
    onchange={setModeTime}
    disabled={isRunning}
  >
    <option value="pomodoro">Pomodoro - 25 min</option>
    <option value="long">Long Focus - 52 min</option>
    <option value="sprint">Learning Sprint - 15 min</option>
    <option value="custom">Custom Countdown</option>
    <option value="stopwatch">Stopwatch</option>
  </select>
</div>

{#if mode === "custom"}
  <div class="form-group">
    <label for="custom-minutes">Custom Minutes</label>

    <input
      id="custom-minutes"
      type="number"
      min="1"
      bind:value={customMinutes}
      onchange={setModeTime}
      disabled={isRunning}
    />
  </div>
{/if}

<div
  class="timer-circle"
  style={`background: conic-gradient(#6c3df4 0% ${getProgress()}%, #eeeeee ${getProgress()}% 100%);`}
>
  <div class="timer-inner">
    {#if mode === "stopwatch"}
      <h2>{formatTime(elapsedTime)}</h2>
    {:else}
      <h2>{formatTime(timeLeft)}</h2>
    {/if}
  </div>
</div>

<div class="timer-buttons">
  <button onclick={startTimer}>Start</button>
  <button onclick={pauseTimer}>Pause</button>
  <button onclick={resetTimer}>Reset</button>
</div>

{#if selectedTaskId}
  <p class="focus-info">Working on selected task.</p>
{/if}

{#if message}
  <p class="success-message">{message}</p>
{/if}
