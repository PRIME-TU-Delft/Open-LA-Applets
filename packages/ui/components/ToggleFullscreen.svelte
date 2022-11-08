<script lang="ts">
  import { mdiFullscreen, mdiFullscreenExit } from '@mdi/js';

  // import Fullscreen from 'svelte-fullscreen';
  import RoundButton from './RoundButton.svelte';
  import { onMount } from 'svelte';

  export let sceneEl: HTMLElement | null = null;
  export let resize: () => void = () => {};

  export let isFullscreen = false; // If window is fullscreen

  let fullscreenSupport = false;

  function toggleFullscreen() {
    // Re-resize after 3 seconds to make sure everything is resized correctly
    setTimeout(resize, 3000);

    if (!fullscreenSupport || !sceneEl) return;

    if (isFullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        isFullscreen = false;
        document.webkitExitFullscreen();
      }

      return resize();
    }

    if (sceneEl.requestFullscreen) {
      sceneEl.requestFullscreen();
    } else if (sceneEl.webkitRequestFullScreen) {
      isFullscreen = true;
      sceneEl?.webkitRequestFullScreen();
      setTimeout(() => resize(), 1000);
    }

    resize();
  }

  onMount(() => {
    fullscreenSupport = !!(
      document.fullscreenEnabled ||
      document.webkitFullscreenEnabled || // this is for cursed Safari
      false
    );

    document.onfullscreenchange = () => {
      isFullscreen = document.fullscreenElement != null;
    };
  });
</script>

{#if fullscreenSupport}
  {#if isFullscreen}
    <RoundButton icon={mdiFullscreenExit} on:click={toggleFullscreen} />
  {:else}
    <RoundButton icon={mdiFullscreen} on:click={toggleFullscreen} />
  {/if}
{/if}
