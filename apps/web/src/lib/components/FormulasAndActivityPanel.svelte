<script>
  import { activityStore } from '$lib/activityStore';
  import { mdiPause } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  export let showFormulas = true;
  export let isChangingSliders = false;
  export let isIframe = false;
  export let isFullscreen = false;
  export let hasFormulas = false;

  let dispatch = createEventDispatcher();
</script>

<div
  class="formulas flex gap-1 w-full absolute z-50 justify-between"
  class:!justify-end={!isIframe || isFullscreen}
>
  <!-- ACTIVITY PANEL -->
  {#if isIframe && !isFullscreen}
    <div class="select-none w-fit">
      {#if $activityStore}
        <button
          style="--btn-text-case: none"
          class="btn btn-sm bg-blue-500/70 hover:bg-blue-500/70 rounded-l-none text-white btn-ghost"
          on:click={() => dispatch('pause')}
        >
          <Icon path={mdiPause} />
          Click here to disable interactivity
        </button>
      {:else}
        <button style="--btn-text-case: none" class="btn btn-sm bg-base-100 rounded-l-none w-fit">
          Click once to enable interactivity
        </button>
      {/if}
    </div>
  {/if}

  <!-- TODO: change this logic -->
  <!-- FORMULAS -->
  {#if hasFormulas && (isChangingSliders || showFormulas || !isIframe || isFullscreen)}
    <div class="menu p-4 bg-base-200 rounded-lg" class:inset={!isIframe || isFullscreen}>
      <slot />
    </div>
  {/if}
</div>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
