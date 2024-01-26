<script lang="ts">
  import type { GridType } from './grids/GridTypes';
  import { select, zoom as zoomD3, type Selection, type BaseType } from 'd3';
  import { onMount } from 'svelte';
  import Axis from './Axis.svelte';
  import { activityStore } from '$lib/activityStore';

  export let width: number;
  export let height: number;
  export let tickLength = 30;
  export let gridType: GridType;
  export let zoom: number = 1;
  export let showAxisNumbers = true;

  const id = 'canvas-' + Math.random().toString(36).substr(2, 9);

  $: vmax = Math.max(width, height);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleZoom(element: SVGSVGElement & { transform: any }) {
    if ($activityStore) {
      select(`#${id} g`).attr('transform', element.transform);
    }
  }

  const zoomProtocol = zoomD3<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3 / zoom, 3 / zoom])
    .on('zoom', handleZoom) as unknown as (
    selection: Selection<BaseType, unknown, HTMLElement, any>
  ) => void;

  function handleResize() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(`#${id}`).call(zoomProtocol);
  }

  onMount(() => {
    select(`#${id}`).call(zoomProtocol);
  });
</script>

<svelte:window on:resize={handleResize} />

<svg {id} {width} {height} viewBox="0 0 {width} {height}">
  <g>
    <g transform-origin="{width / 2} {height / 2}" transform="scale({zoom})">
      <g
        transform="translate({width / 2}, {height / 2}) scale({(2 * vmax) / 30}, {(-1 *
          (2 * vmax)) /
          30})"
      >
        <Axis {showAxisNumbers} length={tickLength} {gridType} />
        <slot />
      </g>
    </g>
  </g>
</svg>
