<script lang="ts">
  export let iframe = false;
  export let idle = true;

  const TIMEOUT = 60_000;

  function hideOverlay() {
    idle = false;
    setTimeout(() => {
      idle = true;
    }, TIMEOUT);
  }
</script>

{#if iframe && idle}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="overlay" on:click={hideOverlay}>Inactive (click to interact)</div>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;

    margin: 0.25em 0.5em;

    font-size: 1em;
    color: black;

    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
