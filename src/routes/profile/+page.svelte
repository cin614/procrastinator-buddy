<script>
  import { onMount } from "svelte";

  let tasks = $state([]);
  let completedTasks = $state(0);
  let openTasks = $state(0);
  let xp = $state(0);
  let focusSessions = $state([]);
  let totalFocusTime = $state(0);
  let focusSessionCount = $state(0);
  let buddies = $state([]);
  let buddyCount = $state(0);
  let challenges = $state([]);
  let challengeWins = $state(0);
  let challengeLosses = $state(0);

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

  function getBadges() {
    return [
      {
        icon: "🌱",
        title: "First Step",
        description: "First task completed",
        unlocked: completedTasks >= 1,
      },
      {
        icon: "✅",
        title: "Task Starter",
        description: "5 tasks completed",
        unlocked: completedTasks >= 5,
      },
      {
        icon: "💎",
        title: "100 XP",
        description: "Reached 100 XP",
        unlocked: xp >= 100,
      },
      {
        icon: "🚀",
        title: "Level Up",
        description: "Reached Level 2",
        unlocked: getLevel().level >= 2,
      },
        {
      icon: "⏰",
      title: "Focus Lover",
      description: "5 focus sessions completed",
      unlocked: focusSessionCount >= 5,
        },
        {
      icon: "🏆",
      title: "Winner Energy",
      description: "Won first challenge",
      unlocked: challengeWins >= 1,
    },
    ];
  }

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

  async function loadStats() {
    const response = await fetch("/api/tasks");
    tasks = await response.json();

    completedTasks = tasks.filter((task) => task.completed).length;
    openTasks = tasks.filter((task) => !task.completed).length;
    xp = calculateXp(tasks);

    const focusResponse = await fetch("/api/focus-sessions");
    focusSessions = await focusResponse.json();

    focusSessionCount = focusSessions.length;
    totalFocusTime = focusSessions.reduce(
      (total, session) => total + session.durationSeconds,
      0,
    );

    const buddyResponse = await fetch("/api/buddies");
    buddies = await buddyResponse.json();

    buddyCount = buddies.length;

    const challengeResponse = await fetch("/api/challenges");
    challenges = await challengeResponse.json();

    challengeWins = challenges.filter(
      (challenge) => challenge.status === "won",
    ).length;

    challengeLosses = challenges.filter(
      (challenge) => challenge.status === "lost",
    ).length;
  }

  function formatFocusTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }

    return `${minutes} min`;
  }
  onMount(() => {
    loadStats();
  });
</script>

<h1>Profile</h1>

<div class="profile-card">
  <div class="profile-avatar">👑</div>

  <h2>{getLevel().title}</h2>
  <p>Level {getLevel().level}</p>

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

<div class="stats-grid">
    <div class="stat-card">
    <h3>{openTasks}</h3>
    <p>Open Tasks</p>
  </div>
  
  <div class="stat-card">
    <h3>{completedTasks}</h3>
    <p>Completed Tasks</p>
  </div>

   <div class="stat-card">
    <h3>{focusSessionCount}</h3>
    <p>Focus Sessions</p>
  </div>

  <div class="stat-card">
    <h3>{formatFocusTime(totalFocusTime)}</h3>
    <p>Focus Time</p>
  </div>

  <div class="stat-card">
  <h3>{challengeWins}</h3>
  <p>Challenge Wins</p>
</div>

<div class="stat-card">
  <h3>{challengeLosses}</h3>
  <p>Challenge Losses</p>
</div>

<div class="stat-card">
    <h3>{buddyCount}</h3>
    <p>Buddies</p>
  </div>
</div>
<h2>Badges</h2>

<div class="badges-grid">
  {#each getBadges() as badge}
    <div class:locked={!badge.unlocked} class="badge-card">
      <span>{badge.icon}</span>
      <h3>{badge.title}</h3>
      <p>{badge.description}</p>
    </div>
  {/each}
</div>
