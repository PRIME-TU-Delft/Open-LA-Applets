<script lang="ts">
  export let idle = true;

  function hideOverlay() {
    idle = false;
    setTimeout(() => {
      idle = true;
    }, 10000);
  }
</script>

{#if idle}
  <div class="overlay" on:click={hideOverlay}>Inactive<br />(click to interact)</div>
{/if}

<style>
  .overlay {
    font-size: 5em;
    color: black;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.8);

    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99999;
  }
</style>
