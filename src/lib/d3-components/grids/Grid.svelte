<script lang="ts">
  import type { scaleLinear } from 'd3';
  import SquareGridX from './SquareGridX.svelte';
  import SquareGridY from './SquareGridY.svelte';
  import TriangleGridX from './TriangleGridX.svelte';
  import TriangleGridY from './TriangleGridY.svelte';
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

{#if type == GridType.Square && side == 'x'}
  <SquareGridX {linearScale} {width} {height} {zoomLevel} {length} />
{:else if type == GridType.Square && side == 'y'}
  <SquareGridY {linearScale} {width} {height} {zoomLevel} {length} />
{:else if type == GridType.Triangle && side == 'x'}
  <TriangleGridX {linearScale} {width} {height} {length} />
{:else if type == GridType.Triangle && side == 'y'}
  <TriangleGridY {linearScale} {width} {height} {zoomLevel} {length} />
{/if}
