<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import ArrowHead2D from './ArrowHead2D.svelte';
  import { getProjection2D } from './Projection2D';

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

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const points: Vector2[] = [];
    const numSteps = Math.ceil((tEnd - tStart) / stepSize);
    for (let i = 0; i <= numSteps; i++) {
      // Compute t independently per step to avoid floating-point drift;
      // clamp the last step to tEnd so the endpoint is always included.
      const t = i < numSteps ? tStart + i * stepSize : tEnd;
      let point: Vector2;

      try {
        // The curve is built from screen-space points.
        point = projection.toScreen(new Vector2(xFunc(t), yFunc(t)));
        if (!isFinite(point.x)) continue;
        if (!isFinite(point.y)) continue;
      } catch {
        continue;
      }
      points.push(point);
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
    stroke-width={width ?? LINE_WIDTH}
    fill="none"
    stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
  />
{/each}
