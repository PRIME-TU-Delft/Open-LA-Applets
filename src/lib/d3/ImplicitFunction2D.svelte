<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { create, all } from 'mathjs';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';

  const math = create(all);

  type ImplicitFunction2DProps = {
    func: string; // function as string, e.g. "x^2 + y^2 = 1"
    color?: string;
    stepSize?: number;
    xMin?: number;
    xMax?: number;
    tension?: number;
    yMin?: number;
    yMax?: number;
    showArrows?: boolean;
  };

  const {
    func,
    color = 'black',
    stepSize = 0.05,
    xMin = -5,
    xMax = 5,
    tension = 0.5,
    showArrows = false,
    yMin = -5,
    yMax = 5
  }: ImplicitFunction2DProps = $props();

  const width = LINE_WIDTH;

  // Remove whitespace for easier parsing
  const funcStr = $derived.by(() => {
    if (!func.includes('=')) {
      console.error('Equation must be in the form "... = ...". Use ImplicitFunction2D for implicit functions.');
    }
    
    return func.replace(/\s/g, '')
  });

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    // Implicit form: find roots for each x
    const [lhs, rhs] = funcStr.split('=');
    if (!lhs || !rhs) return [];
    const zeroExpr = `${lhs}-(${rhs})`;
    const rootArrays: Vector2[][] = [];
    for (let x = xMin; x <= xMax; x += stepSize) {
      const roots: number[] = [];
      try {
        const parsed = math.parse(zeroExpr);
        let prevY = yMin;
        let prevVal = parsed.evaluate({ x, y: prevY });
        for (let y = yMin; y <= yMax; y += stepSize) {
          let val = parsed.evaluate({ x, y });
          if (prevVal * val < 0) {
            // Root in [prevY, y]
            let a = prevY, b = y;
            let prevValBisection = prevVal;
            for (let j = 0; j < 20; j++) {
              const mid = (a + b) / 2;
              const fmid = parsed.evaluate({ x, y: mid });
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
      } catch (e) {
        // Ignore
      }
    }
    return rootArrays.filter(arr => arr && arr.length > 0);
  });

  const smoothLines = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));
    return functionRoots.map(points => l(points));
  })
</script>

{#each functionRoots as points, rootIdx}
  {#each points as point, i}
    {#if showArrows && i > 0 && i < points.length - 1}
      {@const nextPoint = points[i + 1]}
      {@const dir = nextPoint.clone().sub(point).normalize().multiplyScalar(0.5)}
      {@const size = (width ?? 0.5) * 2}
      <g transform={`translate(${point.x}, ${point.y}) rotate(${(dir.angle() * 180) / Math.PI - 90})`}>
        <Triangle2D
          points={[new Vector2(size, 0), new Vector2(-size, 0), new Vector2(0, size * 2)]}
          {color}
        />
      </g>
    {/if}
  {/each}
{/each}

{#each smoothLines as d, idx}
  <path d={d} stroke={color ?? 'black'} stroke-width={width ?? LINE_WIDTH} fill="none" />
{/each}