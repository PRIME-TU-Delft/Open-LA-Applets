<script lang="ts" module>
  import { onDestroy, type Snippet } from 'svelte';
  import { Vector2 } from 'three';

  export type Canvas2DProps = {
    cameraPosition?: Vector2;
    cameraZoom?: number;
    axis?: AxisProps | null;
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
  import { GRID_SIZE_2D } from '$lib/utils/AttributeDimensions';

  import { type ZoomTransform } from 'd3'; // Import types

  let currentTransform = $state(zoomIdentity);

  let {
    cameraPosition = new Vector2(0, 0),
    cameraZoom = 1,
    width = 500,
    height = 300,
    enablePan = true,
    draggables = [],
    isSplit = false,
    axis,
    children
  }: Canvas2DProps = $props();

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
    currentTransform = transform as unknown as ZoomTransform;

    if (!transform.k) return;

    if (enablePan) {
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

  const labelStyles = $derived.by(() => {
    if (!axis) return { x: 'display: none;', y: 'display: none;' };

    const unitScale = width / 15;
    const margin = 12;
    const offsetBase = 25;

    const toScreen = (wX: number, wY: number) => {
      const baseX = width / 2 + (wX - cameraPosition.x) * unitScale * cameraZoom;
      const baseY = height / 2 - (wY - cameraPosition.y) * unitScale * cameraZoom;
      return currentTransform.apply([baseX, baseY]);
    };

    const parsePos = (posStr: string | undefined, isYAxis: boolean) => {
      const defaults = isYAxis
        ? { side: 'left', align: 'end' } // Y default: Left of axis, at Top
        : { side: 'top', align: 'end' }; // X default: Above axis, at Right

      if (!posStr) return defaults;

      const parts = posStr.split('-');

      if (parts.length === 1) {
        if (['top', 'bottom', 'left', 'right'].includes(parts[0])) {
          return { side: parts[0], align: defaults.align };
        }
        return { side: defaults.side, align: parts[0] };
      }

      return { side: parts[0], align: parts[1] };
    };

    const getAlignPos = (size: number, align: string, isYAxis: boolean) => {
      if (isYAxis) {
        // Y-Axis: Start=Bottom, End=Top
        switch (align) {
          case 'start':
            return size - margin * 7.5;
          case 'center':
            return size / 2;
          case 'end':
            return margin;
          default:
            return margin;
        }
      } else {
        // X-Axis: Start=Left, End=Right
        switch (align) {
          case 'start':
            return margin;
          case 'center':
            return size / 2;
          case 'end':
            return size - margin;
          default:
            return size - margin;
        }
      }
    };

    // --- X Label ---
    let xStyle = 'display: none;';
    if (axis.xLabel) {
      const { side, align } = parsePos(axis.xLabelPosition, false);
      const [_rawX, rawY] = toScreen(axis.length || GRID_SIZE_2D, 0);

      const finalX = getAlignPos(width, align, false);

      const offset = side === 'top' ? -offsetBase * 0.5 : offsetBase * 1.25;
      const clampedY = Math.min(Math.max(rawY, margin), height - margin);
      const finalY = clampedY + offset;

      const transY = side === 'top' ? '-100%' : '0%';

      xStyle = `left: ${finalX}px; top: ${finalY}px; transform: translate(-50%, ${transY});`;
    }

    // --- Y Label ---
    let yStyle = 'display: none;';
    if (axis.yLabel) {
      const { side, align } = parsePos(axis.yLabelPosition, true);
      const [rawX, _rawY] = toScreen(0, axis.length || GRID_SIZE_2D);

      const offset = side === 'right' ? offsetBase : -offsetBase;
      const clampedX = Math.min(Math.max(rawX, margin), width - margin);
      const finalX = clampedX + offset;

      const finalY = getAlignPos(height, align, true);

      const textAlign = side === 'right' ? 'left' : 'right';
      const transX = side === 'right' ? '0%' : '-150%';

      yStyle = `left: ${finalX}px; top: ${finalY}px; transform: translate(${transX}, -50%); text-align: ${textAlign};`;
    }

    return { x: xStyle, y: yStyle };
  });
</script>

<div>
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

  {#if axis?.xLabel}
    <LatexUI
      latex={`\\textbf{${axis.xLabel}}`}
      fontSize={1.5}
      class="xLabel absolute"
      style={labelStyles.x}
    />
  {/if}
  {#if axis?.yLabel}
    <LatexUI
      latex={`\\textbf{${axis.yLabel}}`}
      fontSize={1.5}
      class="yLabel absolute"
      style={labelStyles.y}
    />
  {/if}
</div>
