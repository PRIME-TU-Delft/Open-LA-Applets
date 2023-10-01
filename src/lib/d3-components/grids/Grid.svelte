<script lang="ts">
  import type { scaleLinear } from 'd3';
  import SquareGridX from './SquareGridX.svelte';
  import SquareGridY from './SquareGridY.svelte';
  import TriangleGridX from './TriangleGridX.svelte';
  import { GridType } from './GridTypes';

  export let length = 30;
  export let zoomLevel = 1;
  export let width = 0;
  export let height = 0;
  export let linearScale: ReturnType<typeof scaleLinear>;
  export let side: 'x' | 'y' = 'x';
  export let type: GridType;

  console.log({ type });

  const strokeWidth = 0.25;

  $: vmax = Math.max(width, height);
</script>

{#if side == 'x'}
  {#if type == GridType.Square}
    <SquareGridX {linearScale} {width} {height} {zoomLevel} {length} />
  {:else if type == GridType.Triangle}
    <TriangleGridX {linearScale} {width} {height} {zoomLevel} {length} />
  {/if}
{/if}

{#if side == 'y'}
  {#if type == GridType.Square || type == GridType.Triangle}
    <SquareGridY {linearScale} {width} {height} {zoomLevel} {length} />
  {/if}
{/if}
