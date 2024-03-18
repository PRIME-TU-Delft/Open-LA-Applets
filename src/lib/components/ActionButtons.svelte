<script lang="ts">
  import { dev } from '$app/environment';
  import * as Button from '$lib/components/ui/button';
  import * as Dialog from '$lib/components/ui/dialog';
  import { mdiDelete, mdiFullscreen, mdiFullscreenExit, mdiRestart, mdiShare } from '@mdi/js';
  import screenfull from 'screenfull';
  import { createEventDispatcher } from 'svelte';
  import ShareWindow from '$lib/components/ShareWindow.svelte';

  export let isFullscreen = false; // Is the scene fullscreen?
  export let isIframe = true; // Is the scene inside an iframe?
  export let sceneEl: HTMLDivElement;

  let dispatch = createEventDispatcher();

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      isFullscreen = screenfull.isFullscreen;
    });
  }

  function toggleFullscreen() {
    if (!screenfull.isEnabled || !sceneEl) return;

    screenfull.toggle(sceneEl);
  }
</script>

<div
  class="bg-slate-200 rounded-lg absolute bottom-0 right-0 opacity-80 hover:opacity-100 p-1 flex gap-1 flex-col"
  class:inset={!isIframe || isFullscreen}
>
  {#if dev}
    <Button.Action
      on:click={() => (localStorage.clear(), location.reload())}
      icon={mdiDelete}
      tooltip="Delete cache draggables"
    />
  {/if}

  <Dialog.Root>
    <Dialog.Trigger>
      <Button.Action icon={mdiShare} tooltip="Share or embed applet" />
    </Dialog.Trigger>
    <ShareWindow />
  </Dialog.Root>

  <Button.Action on:click={() => dispatch('reset')} icon={mdiRestart} tooltip="Reset applet" />

  {#if screenfull.isEnabled}
    <button on:click={toggleFullscreen}>
      <Button.Action
        icon={isFullscreen ? mdiFullscreenExit : mdiFullscreen}
        tooltip="{isFullscreen ? 'Exit' : 'Enter'} fullscreen"
      />
    </button>
  {/if}
</div>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
