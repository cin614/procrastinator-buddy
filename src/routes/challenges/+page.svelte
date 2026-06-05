<script>
  import { onMount } from "svelte";

  let tasks = $state([]);
  let buddies = $state([]);
  let challenges = $state([]);

  let selectedTaskId = $state("");
  let selectedBuddyId = $state("");
  let stake = $state("");
  let deadline = $state("");
  let message = $state("");

  async function loadData() {
    const taskResponse = await fetch("/api/tasks");
    const allTasks = await taskResponse.json();
    tasks = allTasks.filter((task) => !task.completed);

    const buddyResponse = await fetch("/api/buddies");
    buddies = await buddyResponse.json();

    const challengeResponse = await fetch("/api/challenges");
    challenges = await challengeResponse.json();
  }

  onMount(() => {
    loadData();
  });

  async function createChallenge() {
    const task = tasks.find((task) => task._id === selectedTaskId);
    const buddy = buddies.find((buddy) => buddy._id === selectedBuddyId);

    if (!task || !buddy || !stake || !deadline) {
      message = "Please fill out all fields.";
      return;
    }

    const response = await fetch("/api/challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: task._id,
        taskTitle: task.title,
        buddyId: buddy._id,
        buddyName: buddy.name,
        stake,
        deadline,
      }),
    });

    if (response.ok) {
      message = "Challenge created! 🤝";
      selectedTaskId = "";
      selectedBuddyId = "";
      stake = "";
      deadline = "";
      loadData();
    }
  }

  async function updateStatus(challenge, newStatus) {
    await fetch("/api/challenges", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: challenge._id,
        status: newStatus,
      }),
    });

    loadData();
  }

  async function deleteChallenge(id) {
    await fetch("/api/challenges", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    loadData();
  }

  function formatDeadline(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
</script>

<h1>Challenges</h1>

<div class="profile-card">
  <h2>⚔️ Create Challenge</h2>

  <div class="form-group">
    <label for="challenge-task">Task</label>

    <select id="challenge-task" bind:value={selectedTaskId}>
      <option value="">Select task...</option>

      {#each tasks as task}
        <option value={task._id}>
          {task.title} ({task.priority})
        </option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="challenge-buddy">Buddy</label>

    <select id="challenge-buddy" bind:value={selectedBuddyId}>
      <option value="">Select buddy...</option>

      {#each buddies as buddy}
        <option value={buddy._id}>
          {buddy.name}
        </option>
      {/each}
    </select>
  </div>

  <div class="form-group">
    <label for="challenge-stake">Stake</label>

    <input
      id="challenge-stake"
      bind:value={stake}
      placeholder="e.g. loser buys pizza 🍕"
    />
  </div>

  <div class="form-group">
    <label for="challenge-deadline">Deadline</label>

    <input id="challenge-deadline" type="date" bind:value={deadline} />
  </div>

  <button onclick={createChallenge}>Create Challenge</button>

  {#if message}
    <p class="success-message">{message}</p>
  {/if}
</div>

<h2>🏆 Active Challenges</h2>

{#if challenges.length === 0}
  <div class="empty-state">No challenges yet. Create one with a buddy!</div>
{/if}

{#each challenges as challenge}
  <div class="task-card">
    <div>
      <p>🎯 {challenge.taskTitle}</p>
      <small>Buddy: {challenge.buddyName}</small>
      <br />
      <small>Stake: {challenge.stake}</small>
      <br />
      <small>📅 Due: {formatDeadline(challenge.deadline)}</small>
      <br />
      <small class={`challenge-status ${challenge.status}`}>
        {challenge.status}
      </small>

      <div class="challenge-buttons">
        {#if challenge.status === "pending"}
          <button
            class="small-btn"
            onclick={() => updateStatus(challenge, "accepted")}
          >
            Accept
          </button>
        {/if}

        {#if challenge.status === "accepted"}
          <button
            class="small-btn"
            onclick={() => updateStatus(challenge, "completed")}
          >
            Complete
          </button>
        {/if}

        {#if challenge.status === "completed"}
          <button
            class="small-btn"
            onclick={() => updateStatus(challenge, "won")}
          >
            🏆 I Won
          </button>

          <button
            class="small-btn"
            onclick={() => updateStatus(challenge, "lost")}
          >
            😢 I Lost
          </button>
        {/if}

        <button
          class="delete-btn"
          onclick={() => deleteChallenge(challenge._id)}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/each}
