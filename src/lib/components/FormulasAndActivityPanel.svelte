<script lang="ts">
  import { activityStore } from '$lib/activityStore';
  import { mdiPause } from '@mdi/js';
  import Icon from '$lib/components/Icon.svelte';
  import { createEventDispatcher } from 'svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import LatexUI from '$lib/components/Latex.svelte';

  export let showFormulas = true;
  export let isChangingSliders = false;
  export let isIframe = false;
  export let isFullscreen = false;
  export let formulas: Formula[] = [];

  $: hasFormulas = formulas.length > 0; // Are there any formulas to show?

  let dispatch = createEventDispatcher();
</script>

<div
  class="formulas flex gap-1 w-full top-0 left-0 absolute z-50 justify-between"
  class:!justify-end={!isIframe || isFullscreen}
>
  <!-- ACTIVITY PANEL -->
  {#if isIframe && !isFullscreen}
    <div class="select-none w-fit">
      {#if $activityStore}
        <button
          style="--btn-text-case: none"
          class="btn btn-sm bg-blue-500/70 h-fit hover:bg-blue-500/70 rounded-l-none text-white btn-ghost"
          on:click={() => dispatch('pause')}
        >
          <Icon path={mdiPause} />
          Click here to disable interactivity
        </button>
      {:else}
        <button
          style="--btn-text-case: none"
          class="btn h-fit btn-sm bg-base-100 rounded-l-none w-fit"
        >
          Click once to enable interactivity
        </button>
      {/if}
    </div>
  {/if}

  <!-- FORMULAS -->
  {#if hasFormulas && (isChangingSliders || showFormulas || !isIframe || isFullscreen)}
    <div class="menu p-4 m-2 bg-base-200 rounded-lg" class:inset={!isIframe || isFullscreen}>
      {#each formulas as formula}
        {#key formula.stringFormula}
          <LatexUI latex={formula.stringFormula} />
        {/key}
      {/each}
    </div>
  {/if}
</div>

<style lang="postcss">
  .inset {
    @apply m-2;
  }
</style>
