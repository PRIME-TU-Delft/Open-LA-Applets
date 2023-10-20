<script lang="ts">
  import type { scaleLinear } from 'd3';

  export let length = 30;
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
  </g>

  <g transform="translate({linearScale(d)},0) rotate(-30)">
    <line y1={-2 * vmax} y2={2 * vmax} stroke="black" stroke-width={strokeWidth} />
  </g>
{/each}
