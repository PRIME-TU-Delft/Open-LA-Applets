<script lang="ts">
  import { page } from '$app/stores';
  import { isActive } from '$lib/stores/activityStore';
  import { cameraStore, type Camera2DState } from '$lib/stores/cameraStore';
  import { setPosition, setZoom } from '$lib/utils/parseUrl';
  import { debounce } from '$lib/utils/timeDelay';
  import { select, zoom as zoomD3, type BaseType, type Selection } from 'd3';
  import { onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import type { Canvas2DProps } from '.';
  import Axis from './Axis.svelte';
  import { GridType } from './grids/GridTypes';

  export let cameraPosition: Canvas2DProps['cameraPosition'] = new Vector2(0, 0);
  export let cameraZoom: Canvas2DProps['cameraZoom'] = 1;
  export let width: Canvas2DProps['width'];
  export let height: Canvas2DProps['height'];
  export let tickLength: Canvas2DProps['tickLength'] = 30;
  export let gridType: Canvas2DProps['gridType'] = GridType.Square;

  const id = 'canvas-' + generateUUID();

  $: vmax = Math.max(width, height);

  const debounceCameraStore = debounce((state: Partial<Camera2DState>) => {
    cameraStore.updatePartialState(state);
  }, 1000);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleZoom(element: SVGSVGElement & { transform: { k: number; x: number; y: number } }) {
    if ($isActive) {
      const { transform } = element;

      const state = {
        zoom2D: transform.k
      };

      debounceCameraStore(state);

      select(`#${id} g`).attr('transform', element.transform?.toString());
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

    const url = $page?.url;

    if (!url) return;

    setPosition(url.searchParams);

    // Set the zoom level for the camera
    setZoom(url.searchParams);

    debounceCameraStore({ position2D: cameraPosition, zoom2D: cameraZoom });

    if (!$cameraStore) return;

    if ('position2D' in $cameraStore) cameraPosition = $cameraStore.position2D;

    if ('zoom2D' in $cameraStore) cameraZoom = $cameraStore.zoom2D;

    return () => {
      cameraPosition = new Vector2(0, 0);
      cameraZoom = 1.5;
    };
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
