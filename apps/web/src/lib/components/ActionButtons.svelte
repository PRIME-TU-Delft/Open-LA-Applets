<script lang="ts">
  import { mdiFunctionVariant, mdiRestart, mdiShare } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import RoundButton from './RoundButton.svelte';
  import ToggleFullscreen from './ToggleFullscreen.svelte';
  import { Icon } from 'mdi-svelte-ts';

  export let isFullscreen = false; // Is the scene fullscreen?
  export let isIframe = true; // Is the scene inside an iframe?
  export let hasFormulas = false; // Does the scene have a formulas panel?
  export let showFormulas = false; // Is the formulas panel visible?
  export let sceneEl: HTMLDivElement;

  let dispatch = createEventDispatcher();
</script>

<ul
  class="menu bg-base-200 rounded-lg absolute bottom-0 right-0 opacity-80 hover:opacity-100 p-1"
  class:inset={!isIframe || isFullscreen}
>
  {#if hasFormulas && isIframe && !isFullscreen}
    <li class="tooltip tooltip-left" data-tip="Toggle formulae">
      <RoundButton
        twClass={showFormulas ? 'btn-accent btn-outline' : ''}
        icon={mdiFunctionVariant}
        on:click={() => (showFormulas = !showFormulas)}
      />
    </li>
  {/if}
  <label for="my-drawer">
    <li class="tooltip tooltip-left" data-tip="Share or embed applet">
      <div class="btn btn-square flex flex-col justify-center">
        <Icon path={mdiShare} />
      </div>
    </li>
  </label>
  <li class="tooltip tooltip-left" data-tip="Reset applet">
    <RoundButton icon={mdiRestart} on:click={() => dispatch('reset')} />
  </li>
  <li class="tooltip tooltip-left" data-tip="Toggle fullscreen">
    <ToggleFullscreen {sceneEl} bind:isFullscreen />
  </li>
</ul>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
