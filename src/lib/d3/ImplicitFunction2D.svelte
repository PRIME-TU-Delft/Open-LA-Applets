<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';

  export type ImplicitFunction2DProps = {
    // function as equal to 0, e.g. "x^2 + y^2 = 1" should be passed as x^2 + y^2 - 1
    zeroFunc: (x: number, y: number) => number;
    color?: string;
    stepSize?: number;
    xMin?: number;
    xMax?: number;
    tension?: number;
    yMin?: number;
    yMax?: number;
    showArrows?: boolean;
    width?: number;
  };

  const {
    zeroFunc,
    color = 'black',
    stepSize = 0.05,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = 0.5,
    showArrows = false,
    yMin = -GRID_SIZE_2D,
    yMax = GRID_SIZE_2D,
    width = LINE_WIDTH
  }: ImplicitFunction2DProps = $props();

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    // Implicit form: find roots for each x

    const rootArrays: Vector2[][] = [];
    for (let x = xMin; x <= xMax; x += stepSize) {
      const roots: number[] = [];
      try {
        let prevY = yMin;
        let prevVal = zeroFunc(x, prevY);
        for (let y = yMin; y <= yMax; y += stepSize) {
          let val = zeroFunc(x, y);
          if (prevVal * val < 0) {
            // Root in [prevY, y]
            let a = prevY,
              b = y;
            let prevValBisection = prevVal;
            for (let j = 0; j < 20; j++) {
              const mid = (a + b) / 2;
              const fmid = zeroFunc(x, mid);
              if (Math.abs(fmid) < 1e-3) {
                roots.push(mid);
                break;
              }
              if (prevValBisection * fmid < 0) {
                b = mid;
                val = fmid;
              } else {
                a = mid;
                prevValBisection = fmid;
              }
            }
          }
          prevY = y;
          prevVal = val;
        }
        roots.forEach((y, idx) => {
          if (!isFinite(y)) return;
          if (!rootArrays[idx]) rootArrays[idx] = [];
          rootArrays[idx].push(new Vector2(x, y));
        });
      } catch (_e) {
        // Ignore
      }
    }
    return rootArrays.filter((arr) => arr && arr.length > 0);
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
