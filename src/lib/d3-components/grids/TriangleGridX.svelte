<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { scaleLinear } from 'd3';

  export let length = 30;
  export let zoomLevel = 1;
  export let width = 0;
  export let height = 0;
  export let linearScale: ReturnType<typeof scaleLinear>;

  const strokeWidth = 0.25;

  $: vmax = Math.max(width, height);
</script>

{#each linearScale.ticks(length) as d (d)}
  {@const middleAdd = (2 * vmax) / length}
  <g transform="translate({linearScale(d)},0) rotate(30)">
    <line y1={-2 * vmax} y2={2 * vmax} stroke="black" stroke-width={strokeWidth} />

    {#if zoomLevel >= 1}
      <line
        transition:fade
        y1={-2 * vmax}
        y2={2 * vmax}
        x1={middleAdd}
        x2={middleAdd}
        stroke="black"
        stroke-width={strokeWidth / 2}
      />
    {/if}
    {#if zoomLevel >= 2}
      <line
        transition:fade
        x1={0.5 * middleAdd}
        x2={0.5 * middleAdd}
        y1={-2 * vmax}
        y2={2 * vmax}
        stroke="black"
        stroke-width={strokeWidth / 4}
      />
      <line
        transition:fade
        x1={1.5 * middleAdd}
        x2={1.5 * middleAdd}
        y1={-2 * vmax}
        y2={2 * vmax}
        stroke="black"
        stroke-width={strokeWidth / 4}
      />
    {/if}
  </g>
{/each}
