<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import ArrowHead2D from './ArrowHead2D.svelte';
  import { getProjection2D } from './Projection2D';
  import { getCameraView2D } from './CameraView2D';
  import { strokeWidthFor } from './StrokeWidth';

  export type ParameterizedFunction2DProps = {
    xFunc: (t: number) => number;
    yFunc: (t: number) => number;
    color?: string;
    stepSize?: number;
    tStart?: number;
    tEnd?: number;
    tension?: number;
    showArrows?: boolean;
    width?: number;
    isDashed?: boolean;
  };

  const {
    xFunc,
    yFunc,
    color = 'black',
    stepSize = 0.05,
    tStart = -3,
    tEnd = 3,
    tension = 0.5,
    showArrows = false,
    width = LINE_WIDTH,
    isDashed = false
  }: ParameterizedFunction2DProps = $props();

  const projection = getProjection2D();
  const MAX_STEPS = 5000;

  const view = getCameraView2D();
  const adaptive = $derived(!showArrows);

  // Settled zoom, relative to mount, rounded to a power of two so small zoom changes
  // don't trigger a re-sample (only roughly 2x changes do).
  const zoomLevel = $derived(
    adaptive ? 2 ** Math.round(Math.log2(Math.max(1, view.settled.zoom / view.baseZoom))) : 1
  );

  // Step in t, denser when zoomed in, capped so the point count can't blow up.
  const effStep = $derived(Math.max(stepSize / zoomLevel, Math.abs(tEnd - tStart) / MAX_STEPS));

  const strokeWidth = $derived(strokeWidthFor(width ?? LINE_WIDTH, view.live.zoom, view.baseZoom));
  const dashUnit = $derived(strokeWidthFor(width ?? LINE_WIDTH, view.settled.zoom, view.baseZoom));
  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const points: Vector2[] = [];
    const span = tEnd - tStart;
    const numSteps = Math.max(1, Math.ceil(Math.abs(span) / effStep));

    for (let i = 0; i <= numSteps; i++) {
      // t is computed independently per step and clamped to the range, so the
      // curve never runs past tEnd and the endpoint is always included.
      const t = i < numSteps ? tStart + (i * span) / numSteps : tEnd;

      try {
        const point = projection.toScreen(new Vector2(xFunc(t), yFunc(t)));
        if (!isFinite(point.x) || !isFinite(point.y)) continue;
        points.push(point);
      } catch {
        continue;
      }
    }
    return [points];
  });

  const smoothLines = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));
    return functionRoots.map((points) => l(points));
  });
</script>

{#if showArrows}
  {#each functionRoots as points, rootIdx (rootIdx)}
    {#each points as point, i (i)}
      {#if i > 0 && i < points.length - 1}
        {@const nextPoint = points[i + 1]}
        {@const size = (width ?? 0.5) * 2}
        <ArrowHead2D
          screenPosition={point}
          angle={nextPoint.clone().sub(point).angle()}
          length={size * 2}
          halfWidth={size}
          {color}
        />
      {/if}
    {/each}
  {/each}
{/if}

{#each smoothLines as d, idx (idx)}
  <path
    {d}
    stroke={color ?? 'black'}
    stroke-width={strokeWidth}
    fill="none"
    stroke-dasharray={isDashed ? `${4 * dashUnit} ${4 * dashUnit}` : undefined}
  />
{/each}
