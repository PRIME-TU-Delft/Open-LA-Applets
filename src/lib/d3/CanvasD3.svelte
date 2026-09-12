<script lang="ts" module>
  import { onDestroy, setContext, type Snippet } from 'svelte';
  import { Vector2 } from 'three';

  export type Canvas2DProps = {
    cameraPosition?: Vector2;
    cameraZoom?: number;
    initialViewBox?: ViewBox;
    axis?: AxisProps | null;
    labels?: LabelProps;
    width?: number;
    height?: number;
    enablePan?: boolean;
    draggables?: Draggable[];
    isSplit?: boolean;
    scaleX?: number;
    scaleY?: number;
    children?: Snippet;
  };
</script>

<script lang="ts">
  import type { Draggable } from '$lib/controls/Draggables.svelte';
  import { activityState } from '$lib/stores/activity.svelte';
  import { Camera2D, cameraState, type Transform2D } from '$lib/stores/camera.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import {
    interpolateZoom,
    select,
    zoom,
    zoomIdentity,
    zoomTransform,
    type BaseType,
    type Selection,
    type Transition
  } from 'd3';
  import { untrack } from 'svelte';
  import { generateUUID } from 'three/src/math/MathUtils.js';
  import Axis, { type AxisProps } from './Axis.svelte';
  import Draggable2D from './Draggable2D.svelte';
  import { debounce } from '$lib/utils/TimingFunctions';
  import Confetti from '$lib/components/Confetti.svelte';
  import { confettiState } from '$lib/stores/confetti.svelte';

  import { getXLabelX, getYabelY, type LabelProps } from './AxisLabels';
  import {
    clampCameraZoom,
    fromZoomView,
    toZoomView,
    VISIBLE_SCENE_WIDTH,
    zoomScaleExtent
  } from './CameraMath';
  import Latex2D from './Latex2D.svelte';
  import type { ViewBox } from './ViewBox';

  import { PrimeColor } from '$lib/utils/PrimeColors';

  const CAMERA_TRANSITION_MS = 750;

  let {
    cameraPosition: cameraPositionProp = new Vector2(0, 0),
    cameraZoom: cameraZoomProp = 1,
    initialViewBox: viewBox,
    width = 500,
    height = 300,
    enablePan = true,
    draggables = [],
    isSplit = false,
    axis,
    labels,
    scaleX = 1,
    scaleY = 1,
    children = undefined
  }: Canvas2DProps = $props();

  function toScenePosition(v: Vector2): Vector2 {
    return v.clone().multiply(new Vector2(scaleX, scaleY));
  }

  // svelte-ignore state_referenced_locally
  let cameraZoom = $state(
    viewBox ? viewBox.getCameraZoom(width, height, scaleX, scaleY) : cameraZoomProp
  );
  // svelte-ignore state_referenced_locally
  let cameraPosition = $state(
    viewBox ? viewBox.getCameraPos(scaleX, scaleY) : toScenePosition(cameraPositionProp)
  );

  // Mount-time base zoom, used as the fixed reference for the user zoom range
  // and for clamping programmatic camera moves — never reassigned.
  // svelte-ignore state_referenced_locally
  const initialCameraZoom = cameraZoom;

  let id = 'canvas-' + generateUUID();

  let currentCameraTransform = $state<Transform2D>();

  // svelte-ignore state_referenced_locally
  setContext('is-split', isSplit);
  // svelte-ignore state_referenced_locally
  setContext('default-zoom', cameraZoom);
  // svelte-ignore state_referenced_locally
  setContext('scale2D', { x: scaleX, y: scaleY });

  function update2DCamera(transform2d: Transform2D) {
    const camera = Camera2D.new(
      transform2d,
      cameraZoom,
      initialCameraZoom,
      cameraPosition,
      enablePan
    );
    if (isSplit) cameraState.splitCamera2D = camera;
    else cameraState.camera2D = camera;
  }

  const debouncedUpdate2DCamera = debounce(update2DCamera, 100);

  /**
   * Transform function that translates and scales the whole scene
   * @param transform {x: number, y: number, k: number} - k is zoom
   */
  function transformScene(transform: Transform2D, immediate = false) {
    if (!transform.k) return;

    if (enablePan) {
      select(`#${id} g`).attr('transform', transform).attr('transform-origin', '0 0');
    } else {
      select(`#${id} g`)
        .attr('transform', `scale(${transform.k})`)
        .attr('transform-origin', 'center center');
    }

    const x = VISIBLE_SCENE_WIDTH / (width / -transform.x) + cameraPosition.x;
    const y = VISIBLE_SCENE_WIDTH / (width / transform.y) + cameraPosition.y;

    const transform2d = { x, y, k: transform.k } as Transform2D;

    currentCameraTransform = transform2d;

    // `animateCameraTo` passes `immediate` so cameraState.camera2D (and the
    // share-URL it feeds) stays correct mid-tween — the 100ms debounce below
    // is only appropriate for interactive user pan/zoom, which fires far
    // more often than once per animation frame.
    if (immediate) {
      update2DCamera(transform2d);
    } else {
      debouncedUpdate2DCamera(transform2d);
    }
  }

  /**
   * Zoom protocol for the camera.
   * @see https://observablehq.com/@d3/drag-zoom?collection=@d3/d3-drag
   */
  const zoomProtocol = $derived.by(() => {
    const [minZoom, maxZoom] = zoomScaleExtent(initialCameraZoom);

    return zoom()
      .scaleExtent([minZoom, maxZoom])
      .on('zoom', ({ transform }) => {
        if (!activityState.isActive) return;

        transformScene(transform);
      });
  }) as (selection: Selection<BaseType, unknown, BaseType, unknown>) => void;

  /**
   * Eases the d3-zoom overlay back to identity; the base camera
   * (`cameraZoom`/`cameraPosition`) is untouched — it follows the applet's
   * own props, which an applet's own reset (e.g. `SlideShow.reset()`)
   * restores separately.
   *
   * Shares the 'camera' transition name with `animateCameraTo` so the two
   * interrupt each other instead of running concurrently on the same node.
   */
  function reset() {
    const svg = select(`#${id}`);
    const node = svg.node() as Element;

    const transformFn = zoom().on('zoom', ({ transform }) => {
      transformScene(transform);
    }).transform as (t: Transition<BaseType, unknown, BaseType, unknown>) => void;

    svg
      .transition('camera')
      .duration(CAMERA_TRANSITION_MS)
      .call(transformFn, zoomIdentity, zoomTransform(node).invert([width / 2, height / 2]));

    update2DCamera({ x: 0, y: 0, k: 1 } as Transform2D);
  }

  /**
   * Eases the base camera to a new target via d3's perceptual
   * `interpolateZoom` path; composes with any in-progress user pan/zoom
   * with no jump. Callers (e.g. a SlideShow step) must hold the target
   * constant for the whole step rather than varying it per-tick.
   */
  function animateCameraTo(targetZoomRaw: number, targetPosition: Vector2) {
    const targetZoom = clampCameraZoom(targetZoomRaw, initialCameraZoom);

    const from = toZoomView(cameraPosition, cameraZoom);
    const to = toZoomView(targetPosition, targetZoom);
    const interpolator = interpolateZoom(from, to);

    const svg = select(`#${id}`);
    const node = svg.node() as Element;

    svg
      .transition('camera')
      .duration(CAMERA_TRANSITION_MS)
      .tween('camera', () => (t: number) => {
        const decoded = fromZoomView(interpolator(t));
        cameraPosition = decoded.position;
        cameraZoom = decoded.zoom;

        // Re-derive the camera-state sync payload from the live d3-zoom
        // overlay transform composed with the base we just moved, so
        // legend/axis labels and the share-URL zoom stay correct mid-tween.
        // `immediate: true` bypasses the debounce so cameraState.camera2D
        // updates every tick instead of only ~100ms after the tween ends.
        transformScene(zoomTransform(node) as unknown as Transform2D, true);
      });
  }

  // svelte-ignore state_referenced_locally
  let prevCameraTarget = { zoom: cameraZoomProp, position: cameraPositionProp.clone() };

  /** Eases the base camera to a changed `cameraZoom`/`cameraPosition` prop (e.g. a SlideShow step). */
  $effect(() => {
    const targetZoom = cameraZoomProp;
    const targetPosition = cameraPositionProp;

    if (targetZoom === prevCameraTarget.zoom && targetPosition.equals(prevCameraTarget.position)) {
      return;
    }

    prevCameraTarget = { zoom: targetZoom, position: targetPosition.clone() };

    untrack(() => animateCameraTo(targetZoom, toScenePosition(targetPosition)));
  });

  /** Attach/detach the zoom listener; rebinds on resize. */
  $effect(() => {
    const _ = [width, height];

    if (activityState.isActive) {
      select(`#${id}`).call(zoomProtocol);
    } else {
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

  const xLabelX = $derived(getXLabelX(currentCameraTransform, width, cameraZoom, labels, scaleX));
  const yLabelY = $derived(
    getYabelY(currentCameraTransform, width, height, cameraZoom, labels, scaleY)
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
            <!-- 4. Axis: ticks, axis lines, tick numbers -->
            {#if axis !== null}
              <Axis {...axis} />
            {/if}

            <!-- 3. Scene components -->
            {#if children}
              {@render children()}
            {/if}

            <!-- 2. Axis labels -->
            {#if labels?.xLabel}
              <Latex2D
                dimOnHover={true}
                latex={labels.xLabel}
                fontSize={labels.size || 1}
                position={new Vector2(
                  xLabelX + (labels?.xLabelOffset?.x ?? 0),
                  0.75 / scaleY + (labels?.xLabelOffset?.y ?? 0)
                )}
                alignX={labels.xLabelPosition == 'center' ? 'center' : 'right'}
                color={labels?.xColor ?? axis?.colorX ?? PrimeColor.black}
              />
            {/if}
            {#if labels?.yLabel}
              <Latex2D
                dimOnHover={true}
                latex={labels.yLabel}
                fontSize={labels.size || 1}
                position={new Vector2(
                  0.25 / scaleX +
                    (labels.yLabelRotate ? 0.5 / scaleX : 0) +
                    (labels?.yLabelOffset?.x ?? 0),
                  yLabelY + +(labels?.yLabelOffset?.y ?? 0)
                )}
                rotation={labels.yLabelRotate ? -90 : 0}
                alignX={labels.xLabelPosition == 'center' ? 'center' : 'left'}
                color={labels?.yColor ?? axis?.colorY ?? PrimeColor.black}
              />
            {/if}

            <!-- 1. Draggables on top of everything -->
            {#each draggables as d (d.id)}
              <Draggable2D draggable={d} />
            {/each}
          </g>
        </g>
      </g>
    </g>
  </svg>
</div>
