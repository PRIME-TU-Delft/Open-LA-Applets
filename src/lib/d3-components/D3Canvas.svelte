<script lang="ts">
  import type { GridType } from './grids/GridTypes';
  import { select, zoom } from 'd3';
  import { onMount } from 'svelte';
  import Axis from './Axis.svelte';

  export let width: number;
  export let height: number;
  export let tickLength = 30;
  export let gridType: GridType;

  let svg: SVGSVGElement;
  let zoomLevel = 1;

  $: vmax = Math.max(width, height);

  function handleZoom(e: any) {
    zoomLevel = e.transform.k;
    select('svg g').attr('transform', e.transform);
  }

  const zoomProtocol = zoom<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3, 3])
    .on('zoom', handleZoom);

  function handleResize() {
    select(svg).call(zoomProtocol);
  }

  onMount(() => {
    select(svg).call(zoomProtocol);
  });
</script>

<svelte:window on:resize={handleResize} />

<svg bind:this={svg} {width} {height} viewBox="0 0 {width} {height}">
  <g>
    <Axis {width} {height} {zoomLevel} length={tickLength} {gridType} />

    <g
      transform="translate({width / 2}, {height / 2}) scale({(2 * vmax) / 30}, {(-1 * (2 * vmax)) /
        30})"
    >
      <slot />
    </g>
  </g>
</svg>