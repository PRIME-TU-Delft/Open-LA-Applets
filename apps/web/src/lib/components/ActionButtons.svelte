<script lang="ts">
  import { activityStore } from '$lib/activityStore';
  import { mdiFunctionVariant, mdiPause, mdiRestart } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import RoundButton from './RoundButton.svelte';
  import ToggleFullscreen from './ToggleFullscreen.svelte';

  export let isFullscreen = false; // Is the scene fullscreen?
  export let isIframe = true; // Is the scene inside an iframe?
  export let hasFormulas = false; // Does the scene have a formulas panel?
  export let sceneEl: HTMLDivElement;

  let dispatch = createEventDispatcher();
</script>

<ul
  class="menu bg-base-200 rounded-lg absolute bottom-0 right-0 opacity-80 hover:opacity-100 transition-all"
  class:inset={!isIframe || isFullscreen}
>
  {#if $activityStore && isIframe}
    <li class="tooltip tooltip-left" data-tip="Pause applet">
      <RoundButton icon={mdiPause} on:click={() => dispatch('pause')} />
    </li>
  {/if}
  {#if hasFormulas && isIframe && !isFullscreen}
    <li class="tooltip tooltip-left" data-tip="Toggle formulae">
      <RoundButton icon={mdiFunctionVariant} on:click={() => dispatch('toggle-formulas')} />
    </li>
  {/if}
  <li class="tooltip tooltip-left" data-tip="Reset applet">
    <RoundButton icon={mdiRestart} on:click={() => dispatch('reset')} />
  </li>
  <li class="tooltip tooltip-left" data-tip="Toggle fullscreen">
    <ToggleFullscreen {sceneEl} bind:isFullscreen />
  </li>
</ul>

<style lang="postcss">
  .inset {
    @apply bottom-2 right-2;
  }
</style>
