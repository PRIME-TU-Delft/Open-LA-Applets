<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { create, all } from 'mathjs';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';

  const math = create(all);

  type ExplicitFunction2DProps = {
    func: string; // function as string, e.g. "y = sin(x)" or "x^2 + y^2 = 1"
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
    showArrows = false
  }: ExplicitFunction2DProps = $props();

  const width = LINE_WIDTH;

  // Remove whitespace for easier parsing
  const funcStr = func.replace(/\s/g, '');

  // Detect explicit form: y=... or just an expression in x
  let explicitExpr: string;

  if (/^y=/.test(funcStr)) {
    explicitExpr = funcStr.replace(/^y=/, '');
  } else if (!funcStr.includes('=')) {
    explicitExpr = funcStr;
  } else {
    console.error('Implicit functions are not supported in this component. Use ImplicitFunction2D instead.');
  }

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const parsed = math.parse(explicitExpr);
    const points: Vector2[] = [];
    for (let x = xMin; x <= xMax; x += stepSize) {
      let y: number;
      try {
        y = parsed.evaluate({ x });
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
    return functionRoots.map(points => l(points));
  });
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
