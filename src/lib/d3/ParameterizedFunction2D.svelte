<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';

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
    width = LINE_WIDTH
  }: ParameterizedFunction2DProps = $props();

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const points: Vector2[] = [];
    for (let t = tStart; t <= tEnd; t += stepSize) {
      let x: number;
      let y: number;

      try {
        x = xFunc(t);
        y = yFunc(t);
        if (!isFinite(x)) continue;
        if (!isFinite(y)) continue;
      } catch {
        continue;
      }
      points.push(new Vector2(x, y));
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
        {@const dir = nextPoint.clone().sub(point).normalize().multiplyScalar(0.5)}
        {@const size = (width ?? 0.5) * 2}
        <g
          transform={`translate(${point.x}, ${point.y}) rotate(${(dir.angle() * 180) / Math.PI - 90})`}
        >
          <Triangle2D
            points={[new Vector2(size, 0), new Vector2(-size, 0), new Vector2(0, size * 2)]}
            {color}
          />
        </g>
      {/if}
    {/each}
  {/each}
{/if}

{#each smoothLines as d, idx (idx)}
  <path {d} stroke={color ?? 'black'} stroke-width={width ?? LINE_WIDTH} fill="none" />
{/each}
