<script lang="ts">
  import { GridType } from './grids/GridTypes';
  import { select, zoom as zoomD3, type Selection, type BaseType } from 'd3';
  import { onMount } from 'svelte';
  import Axis from './Axis.svelte';
  import { isActive } from '$lib/activityStore';
  import { Vector2 } from 'three';
  import type { Canvas2DProps } from '.';

  export let cameraPosition: Canvas2DProps['cameraPosition'] = new Vector2(0, 0);
  export let cameraZoom: Canvas2DProps['cameraZoom'] = 1;
  export let width: Canvas2DProps['width'];
  export let height: Canvas2DProps['height'];
  export let tickLength: Canvas2DProps['tickLength'] = 30;
  export let gridType: Canvas2DProps['gridType'] = GridType.Square;

  const id = 'canvas-' + Math.random().toString(36).substr(2, 9);

  $: vmax = Math.max(width, height);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleZoom(element: SVGSVGElement & { transform: any }) {
    if ($isActive) {
      select(`#${id} g`).attr('transform', element.transform);
    }
  }

  const zoomProtocol = zoomD3<SVGSVGElement, unknown>()
    .scaleExtent([1 / 3 / cameraZoom, 3 / cameraZoom])
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
    <g transform-origin="{width / 2} {height / 2}" transform="scale({cameraZoom})">
      <g
        transform="translate({width / 2}, {height / 2}) scale({(2 * vmax) / 30}, {(-1 *
          (2 * vmax)) /
          30})"
      >
        <g transform="translate({-cameraPosition.x}, {-cameraPosition.y})">
          <Axis length={tickLength} {gridType} />
          <slot />
        </g>
      </g>
    </g>
  </g>
</svg>
