<script lang="ts">
  import { fade } from 'svelte/transition';
  import type { scaleLinear } from 'd3';

  export let length = 30;
  export let zoomLevel = 1;
  export let width = 0;
  export let height = 0;
  export let linearScale: ReturnType<typeof scaleLinear>;

  const strokeWidth = 0.25;
  const tan60Deg = Math.tan(Math.PI / 3);

  $: vmax = Math.max(width, height);
</script>

{#each linearScale.ticks(length) as d (d)}
  {@const middleAdd = ((tan60Deg / 2) * (2 * vmax)) / length}
  {#if d != 0}
    <g transform="translate(0,{height / 2 + middleAdd * d})">
      <line x1={-2 * vmax} x2={2 * vmax} stroke="black" stroke-width={strokeWidth} />
      {#if zoomLevel >= 1}
        <line
          transition:fade
          y1={middleAdd}
          y2={middleAdd}
          x1={-2 * vmax}
          x2={2 * vmax}
          stroke="black"
          stroke-width={strokeWidth / 2}
        />
      {/if}
      {#if zoomLevel >= 2}
        <line
          transition:fade
          y1={0.5 * middleAdd}
          y2={0.5 * middleAdd}
          x1={-2 * vmax}
          x2={2 * vmax}
          stroke="black"
          stroke-width={strokeWidth / 4}
        />
        <line
          transition:fade
          y1={1.5 * middleAdd}
          y2={1.5 * middleAdd}
          x1={-2 * vmax}
          x2={2 * vmax}
          stroke="black"
          stroke-width={strokeWidth / 4}
        />
      {/if}
    </g>
  {/if}
{/each}
