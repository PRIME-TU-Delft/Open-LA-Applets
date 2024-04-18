<script lang="ts">
  import { isActive } from '$lib/stores/activityStore';
  import Icon from '$lib/components/Icon.svelte';
  import LatexUI from '$lib/components/Latex.svelte';
  import * as Button from '$lib/components/ui/button';
  import * as Popover from '$lib/components/ui/popover';
  import type { Formula } from '$lib/utils/Formulas';
  import { mdiFunctionVariant, mdiPause } from '@mdi/js';
  import { createEventDispatcher } from 'svelte';
  import { isInset } from '$lib/stores/globalStateStore';

  export let showFormulas = true;
  export let isChangingSliders = false;
  export let formulas: Formula[] = [];

  $: hasFormulas = formulas.length > 0; // Are there any formulas to show?

  let dispatch = createEventDispatcher();

  $: popoverClass = $isInset ? 'm-2' : 'm-0';
</script>

<div
  class="formulas flex gap-1 w-full top-0 left-0 absolute z-50 justify-between"
  class:!justify-end={$isInset}
>
  <!-- TODO: improve formulas -->
  {#if hasFormulas && false}
    <Popover.Root open={isChangingSliders || showFormulas || $isInset}>
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
