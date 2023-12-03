<script lang="ts">
  import type { GridType } from './grids/GridTypes';
  import { select, zoom as zoomD3 } from 'd3';
  import { onMount } from 'svelte';
  import Axis from './Axis.svelte';

  export let width: number;
  export let height: number;
  export let tickLength = 30;
  export let gridType: GridType;
  export let zoom: number = 1;

  const id = 'canvas-' + Math.random().toString(36).substr(2, 9);
  let svg: SVGSVGElement;

  $: vmax = Math.max(width, height);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleZoom(e: any) {
    select(`#${id} g`).attr('transform', e.transform);
  }

  const zoomProtocol = zoomD3<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3 / zoom, 3 / zoom])
    .on('zoom', handleZoom);

  function handleResize() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(`#${id}`).call(zoomProtocol as any);
  }

  onMount(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(`#${id}`).call(zoomProtocol as any);
  });
</script>

<svelte:window on:resize={handleResize} />

<svg {id} bind:this={svg} {width} {height} viewBox="0 0 {width} {height}">
  <g>
    <g transform-origin="{width / 2} {height / 2}" transform="scale({zoom})">
      <g
        transform="translate({width / 2}, {height / 2}) scale({(2 * vmax) / 30}, {(-1 *
          (2 * vmax)) /
          30})"
      >
        <Axis length={tickLength} {gridType} />
        <slot />
      </g>
    </g>
  </g>
</svg>
