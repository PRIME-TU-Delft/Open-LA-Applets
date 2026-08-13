<script lang="ts" module>
  export type LegendFormulaAnchor =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-right';
</script>

<script lang="ts">
  import LatexUI from '$lib/components/Latex.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import type { Formula } from '$lib/utils/Formulas';
  import type { LegendItem } from '$lib/utils/Legend';
  import LegendItemComponent from './LegendItemComponent.svelte';
  import { cn } from '$lib/utils';

  type LegendFormulaPanelProps = {
    formulas?: Formula[];
    legendItems?: LegendItem[];
    splitFormulas?: Formula[];
    splitLegendItems?: LegendItem[];
    showFormulas: boolean;
    position?: LegendFormulaAnchor;
    onHeightChange?: (height: number) => void;
  };

  let {
    formulas = [],
    legendItems = [],
    splitFormulas = [],
    splitLegendItems = [],
    showFormulas = false,
    position = 'top-right',
    titleWidth = 0,
    onHeightChange
  }: LegendFormulaPanelProps & { titleWidth?: number } = $props();

  let panelHeight = $state(0);

  $effect(() => {
    onHeightChange?.(panelHeight);
  });

  // svelte-ignore state_referenced_locally
  if (legendItems?.length >= 1) showFormulas = true;

  let formulasShown = $derived(
    globalState.controlsInteractive || showFormulas || globalState.isInset()
  );

  const hasMain = $derived(
    (formulas && formulas.length >= 1) || (legendItems && legendItems.length >= 1)
  );
  const hasSplit = $derived(
    (splitFormulas && splitFormulas.length >= 1) ||
      (splitLegendItems && splitLegendItems.length >= 1)
  );

  //   top-right should place the legend and formulas above the action buttons
  //   top-left should place the legend next to the title
  const anchorClasses: Record<Exclude<LegendFormulaAnchor, 'top-left'>, string> = {
    'top-right': 'top-1 right-0 items-end',
    'top-center': 'top-1 left-1/2 -translate-x-1/2 items-center',
    'center-left': 'top-1/2 left-0 -translate-y-1/2 items-start',
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center',
    'center-right': 'top-1/2 right-0 -translate-y-1/2 items-end',
    'bottom-left': 'bottom-1 left-0 items-start',
    'bottom-right': 'bottom-1 right-0 items-end'
  };
  const topLeftOffset = $derived(titleWidth > 0 ? titleWidth + 12 : 96);
</script>

{#if formulasShown && (hasMain || hasSplit)}
  <!-- Top left positioning depends on title size so has different handling than other cases -->
  {#if position === 'top-left'}
    <div
      class="absolute top-1 flex flex-col items-start gap-1 p-1 select-none"
      style="left: {topLeftOffset}px"
      bind:clientHeight={panelHeight}
    >
      {#if hasMain}
        <div
          class="mx-2 grid gap-1 rounded-md border-3 border-blue-500 bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md"
        >
          {#each formulas as formula (formula.id)}
            {#key formula.latex}
              <LatexUI latex={formula.latex} />
            {/key}
          {/each}

          {#if formulas.length >= 1 && legendItems.length >= 1}
            <hr class="h-[1px] border-none bg-black" />
          {/if}

          {#each legendItems as legendI (legendI.id)}
            {#key legendI.latex}
              <LegendItemComponent {legendI} />
            {/key}
          {/each}
        </div>
      {/if}

      {#if hasSplit}
        <div class="grid gap-1 rounded-md bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md">
          {#each splitFormulas as formula (formula.id)}
            {#key formula.latex}
              <LatexUI latex={formula.latex} />
            {/key}
          {/each}

          {#if splitFormulas.length >= 1 && splitLegendItems.length >= 1}
            <hr class="h-[1px] border-none bg-black" />
          {/if}

          {#each splitLegendItems as legendI (legendI.id)}
            {#key legendI.latex}
              <LegendItemComponent {legendI} />
            {/key}
          {/each}
        </div>
      {/if}
    </div>
  {:else}
    <div
      class={cn('absolute flex flex-col gap-1 p-1 select-none', anchorClasses[position])}
      bind:clientHeight={panelHeight}
    >
      {#if hasMain}
        <div
          class="mx-2 grid gap-1 rounded-md border-3 border-blue-500 bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md"
        >
          {#each formulas as formula (formula.id)}
            {#key formula.latex}
              <LatexUI latex={formula.latex} />
            {/key}
          {/each}

          {#if formulas.length >= 1 && legendItems.length >= 1}
            <hr class="h-[1px] border-none bg-black" />
          {/if}

          {#each legendItems as legendI (legendI.id)}
            {#key legendI.latex}
              <LegendItemComponent {legendI} />
            {/key}
          {/each}
        </div>
      {/if}

      {#if hasSplit}
        <div class="grid gap-1 rounded-md bg-blue-50/80 p-2 text-xs shadow-sm backdrop-blur-md">
          {#each splitFormulas as formula (formula.id)}
            {#key formula.latex}
              <LatexUI latex={formula.latex} />
            {/key}
          {/each}

          {#if splitFormulas.length >= 1 && splitLegendItems.length >= 1}
            <hr class="h-[1px] border-none bg-black" />
          {/if}

          {#each splitLegendItems as legendI (legendI.id)}
            {#key legendI.latex}
              <LegendItemComponent {legendI} />
            {/key}
          {/each}
        </div>
      {/if}
    </div>
  {/if}
{:else}
  {((panelHeight = 0), '')}
{/if}
