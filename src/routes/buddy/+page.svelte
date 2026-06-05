<script>
  import { onMount } from "svelte";

  let buddies = $state([]);
  let name = $state("");
  let email = $state("");
  let message = $state("");

  async function loadBuddies() {
    const response = await fetch("/api/buddies");
    buddies = await response.json();
  }

  onMount(() => {
    loadBuddies();
  });

  async function addBuddy() {
    if (!name || !email) {
      message = "Please enter name and email.";
      return;
    }

    const response = await fetch("/api/buddies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        status: "pending"
      })
    });

    if (response.ok) {
      message = "Buddy invitation created! 💌";
      name = "";
      email = "";
      loadBuddies();
    }
  }
</script>

<h1>Buddy</h1>

<div class="profile-card">
  <h2>💌 Add Buddy</h2>

  <div class="form-group">
    <label for="buddy-name">Name</label>
    <input id="buddy-name" bind:value={name} placeholder="e.g. Anna" />
  </div>

  <div class="form-group">
    <label for="buddy-email">E-Mail</label>
    <input id="buddy-email" type="email" bind:value={email} placeholder="e.g. anna@mail.com" />
  </div>

  <button onclick={addBuddy}>Send Invite</button>

  {#if message}
    <p class="success-message">{message}</p>
  {/if}
</div>

<h2>🌸 My Buddies</h2>

{#if buddies.length === 0}
  <div class="empty-state">
    No buddies yet. Invite someone to stay motivated together!
  </div>
{/if}

{#each buddies as buddy}
  <div class="task-card">
    <div>
      <p>{buddy.name}</p>
      <small>{buddy.email}</small>
      <br />
      <small class="priority medium">{buddy.status}</small>
    </div>
  </div>
{/each}