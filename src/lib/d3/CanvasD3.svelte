<script lang="ts" context="module">
  import { onDestroy, type Snippet } from 'svelte';
  import { Vector2 } from 'three';

  export type Canvas2DProps = {
    cameraPosition?: Vector2;
    cameraZoom?: number;
    tickLength?: number; // TODO: move axis to separate component
    showAxisNumbers?: boolean;
    width: number;
    enablePan?: boolean;
    draggables?: Draggable[];
    isSplit?: boolean;
    children: Snippet;
  };
</script>

<script lang="ts">
  import type { Draggable } from '$lib/controls/Draggables.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { Camera2D, cameraState, type Transform2D } from '$lib/stores/camera.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import {
    select,
    zoom,
    zoomIdentity,
    zoomTransform,
    type BaseType,
    type Selection,
    type Transition
  } from 'd3';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import Axis from './Axis.svelte';
  import Draggable2D from './Draggable2D.svelte';
  import { debounce } from '$lib/utils/TimingFunctions';
  import Confetti from '$lib/components/Confetti.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';

  let {
    cameraPosition = new Vector2(0, 0),
    cameraZoom = 1,
    tickLength,
    showAxisNumbers,
    width,
    enablePan = true,
    draggables = [],
    isSplit = false,
    children
  }: Canvas2DProps = $props();

  let id = 'canvas-' + generateUUID();

  let height = $derived(globalState.height);

  function update2DCamera(transform2d: Transform2D) {
    // Update camera
    if (isSplit) cameraState.splitCamera2D = Camera2D.new(transform2d, enablePan);
    else cameraState.camera2D = Camera2D.new(transform2d, enablePan);
  }

  const debouncedUpdate2DCamera = debounce(update2DCamera, 100);

  /**
   * Transform function that translates and scales the whole scene
   * @param transform {x: number, y: number, k: number} - k is zoom
   */
  function transformScene(transform: Transform2D) {
    if (enablePan) {
      select(`#${id} g`).attr('transform', transform).attr('transform-origin', '0 0');
    } else {
      select(`#${id} g`)
        .attr('transform', `scale(${transform.k})`)
        .attr('transform-origin', 'center center');
    }

    const x = 15 / (width / -transform.x) + cameraPosition.x ?? 0;
    const y = 15 / (width / transform.y) + cameraPosition.y ?? 0;

    const transform2d = { x, y, k: transform.k } as Transform2D;

    debouncedUpdate2DCamera(transform2d);
  }

  /**
   * Zoom protocol for the camera.
   * @see https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
   */
  const zoomProtocol = $derived.by(() => {
    const minZoom = cameraZoom / 3;
    const maxZoom = 3 / cameraZoom;

    return zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', ({ transform }) => {
        if (!activityState.isActive) return;

        transformScene(transform);
      });
  }) as (selection: Selection<BaseType, unknown, BaseType, unknown>) => void;

  /**
   * Reset the camera position and zoom level.
   * This function is called when the reset button is clicked.
   * It will animate the camera to the default position and zoom level in 750ms.
   */
  function reset() {
    const svg = select(`#${id}`);
    const node = svg.node() as Element;

    const transformFn = zoom().on('zoom', ({ transform }) => {
      transformScene(transform);
    }).transform as (t: Transition<BaseType, unknown, BaseType, unknown>) => void;

    svg
      .transition()
      .duration(750)
      .call(transformFn, zoomIdentity, zoomTransform(node).invert([width / 2, height / 2]));

    // Update camera
    if (isSplit) cameraState.splitCamera2D = new Camera2D(0, 0, 1);
    else cameraState.camera2D = new Camera2D(0, 0, 1);
  }

  $effect(() => {
    const _ = [width, height, cameraPosition, cameraZoom]; // update when width, height or camera changes

    if (activityState.isActive) {
      // Attach the zoom event listener
      select(`#${id}`).call(zoomProtocol);
    } else {
      // Release the zoom event listener
      select(`#${id}`).on('.zoom', null);
    }
  });

  /**
   * Reset the d3 canvas when the reset key changes.
   */
  $effect(() => {
    const _ = globalState.resetKey;

    reset();
  });

  // Remove / clean-upw camera store entries
  onDestroy(() => {
    if (isSplit) cameraState.splitCamera2D = undefined;
    else cameraState.camera2D = undefined;
  });
</script>

<div>
  {#if !isSplit && (confettiState.side === 'left' || confettiState.side === 'center')}
    <Confetti isSplit={false} />
  {:else if isSplit && confettiState.side === 'right'}
    <Confetti isSplit={true} />
  {/if}

  <svg {id} {width} {height} viewBox="0 0 {width} {height}">
    <g>
      <g transform-origin="{width / 2} {height / 2}" transform="scale({cameraZoom})">
        <g
          transform="translate({width / 2}, {height / 2}) scale({(2 * width) / 30}, {(-1 *
            (2 * width)) /
            30})"
        >
          <g transform="translate({-cameraPosition.x}, {-cameraPosition.y})">
            <Axis {showAxisNumbers} length={tickLength} />
            {@render children()}

            {#each draggables as d}
              <Draggable2D draggable={d} />
            {/each}
          </g>
        </g>
      </g>
    </g>
  </svg>
</div>
