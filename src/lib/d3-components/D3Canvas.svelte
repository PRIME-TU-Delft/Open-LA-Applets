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
  let zoomLevel = 1;

  $: vmax = Math.max(width, height);

  function handleZoom(e: any) {
    zoomLevel = e.transform.k;

    select(`#${id} g`).attr('transform', e.transform);
  }

  const zoomProtocol = zoomD3<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3 / zoom, 3 / zoom])
    .on('zoom', handleZoom);

  function handleResize() {
    select(`#${id}`).call(zoomProtocol);
  }

  onMount(() => {
    select(`#${id}`).call(zoomProtocol);
  });
</script>

<svelte:window on:resize={handleResize} />

<svg {id} bind:this={svg} {width} {height} viewBox="0 0 {width} {height}">
  <g>
    <g transform-origin="{width / 2} {height / 2}" transform="scale({zoom})">
      <Axis {width} {height} {zoomLevel} length={tickLength} {gridType} />

      <g
        transform="translate({width / 2}, {height / 2}) scale({(2 * vmax) / 30}, {(-1 *
          (2 * vmax)) /
          30})"
      >
        <slot />
      </g>
    </g>
  </g>
</svg>
