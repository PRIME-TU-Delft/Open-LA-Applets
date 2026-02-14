<script lang="ts" module>
  import { onDestroy, type Snippet } from 'svelte';
  import { Vector2 } from 'three';

  export type Canvas2DProps = {
    cameraPosition?: Vector2;
    cameraZoom?: number;
    axis?: AxisProps | null;
    labels?: LabelProps;
    width?: number;
    height?: number;
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
  import Axis, { type AxisProps } from './Axis.svelte';
  import Draggable2D from './Draggable2D.svelte';
  import { debounce } from '$lib/utils/TimingFunctions';
  import Confetti from '$lib/components/Confetti.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';
  import LatexUI from '$lib/components/Latex.svelte';

  import { type ZoomTransform } from 'd3'; // Import types
  import { getLabelStyles, type LabelProps } from './AxisLabels';

  let {
    cameraPosition = new Vector2(0, 0),
    cameraZoom = 1,
    width = 500,
    height = 300,
    enablePan = true,
    draggables = [],
    isSplit = false,
    axis,
    labels,
    children
  }: Canvas2DProps = $props();

  let currentTransform = $state(zoomIdentity);

  let id = 'canvas-' + generateUUID();

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
    if (!transform.k) return;

    if (enablePan) {
      currentTransform = transform as unknown as ZoomTransform;
      select(`#${id} g`).attr('transform', transform).attr('transform-origin', '0 0');
    } else {
      select(`#${id} g`)
        .attr('transform', `scale(${transform.k})`)
        .attr('transform-origin', 'center center');
    }

    const x = 15 / (width / -transform.x) + cameraPosition.x;
    const y = 15 / (width / transform.y) + cameraPosition.y;

    const transform2d = { x, y, k: transform.k } as Transform2D;

    debouncedUpdate2DCamera(transform2d);
  }

  /**
   * Zoom protocol for the camera.
   * @see https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
   */
  const zoomProtocol = $derived.by(() => {
    const minZoom = cameraZoom / 6;
    const maxZoom = 6 / cameraZoom;

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
    currentTransform = zoomIdentity;

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

  const labelStyles = $derived(
    getLabelStyles(
      labels,
      axis || undefined,
      cameraPosition,
      cameraZoom,
      currentTransform,
      width,
      height
    )
  );
</script>

<div class="relative overflow-hidden">
  {#if !isSplit && (confettiState.confettiSide === 'left' || confettiState.confettiSide === 'center')}
    <Confetti isSplit={false} />
  {:else if isSplit && confettiState.confettiSide === 'right'}
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
            {#if axis !== null}
              <Axis {...axis} />
            {/if}

            {@render children()}

            {#each draggables as d (d.id)}
              <Draggable2D draggable={d} />
            {/each}
          </g>
        </g>
      </g>
    </g>
  </svg>

  {#if labels?.xLabel}
    <LatexUI
      latex={`\\textbf{${labels.xLabel}}`}
      fontSize={(labels.size || 1) * 1.5}
      class="xLabel absolute"
      style={labelStyles.x}
    />
  {/if}
  {#if labels?.yLabel}
    <LatexUI
      latex={`\\textbf{${labels.yLabel}}`}
      fontSize={(labels.size || 1) * 1.5}
      class="yLabel absolute"
      style={labelStyles.y}
    />
  {/if}
</div>
