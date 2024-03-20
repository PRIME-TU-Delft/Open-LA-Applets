<script lang="ts">
  import { activityStore } from '$lib/activityStore';
  import Icon from '$lib/components/Icon.svelte';
  import LatexUI from '$lib/components/Latex.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Popover from '$lib/components/ui/popover';
  import type { Formula } from '$lib/utils/Formulas';
  import { mdiFunctionVariant, mdiPause } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';

  export let showFormulas = true;
  export let isChangingSliders = false;
  export let isIframe = false;
  export let isFullscreen = false;
  export let formulas: Formula[] = [];

  $: hasFormulas = formulas.length > 0; // Are there any formulas to show?

  let dispatch = createEventDispatcher();

  $: popoverClass = !isIframe || isFullscreen ? 'm-2' : 'm-0';
</script>

<div
  class="formulas flex gap-1 w-full top-0 left-0 absolute z-50 justify-between"
  class:!justify-end={!isIframe || isFullscreen}
>
  {#if isIframe && !isFullscreen}
    <div class="select-none w-fit">
      {#if $activityStore}
        <button
          class="bg-blue-500/70 h-fit p-1 inline-flex items-center gap-1 hover:bg-blue-500/70 rounded rounded-l-none text-white"
          on:click={() => dispatch('pause')}
        >
          <Icon path={mdiPause} />
          Click here to disable interactivity
        </button>
      {:else}
        <button class="h-fit btn-sm bg-slate-100/70 p-1 rounded rounded-l-none w-fit">
          Click once to enable interactivity
        </button>
      {/if}
    </div>
  {/if}

  {#if hasFormulas}
    <Popover.Root open={isChangingSliders || showFormulas || !isIframe || isFullscreen}>
      <Popover.Trigger asChild let:builder>
        <Button.Root class={popoverClass} builders={[builder]} variant="outline">
          <Icon path={mdiFunctionVariant} />
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content class="w-80">
        <div class="grid gap-1">
          {#each formulas as formula}
            {#key formula.stringFormula}
              <LatexUI latex={formula.stringFormula} />
            {/key}
          {/each}
        </div>
      </Popover.Content>
    </Popover.Root>
  {/if}
</div>
