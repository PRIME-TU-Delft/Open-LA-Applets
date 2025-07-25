<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { create, all } from 'mathjs';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';

  const math = create(all);

  export type ExplicitFunction2DProps = {
    func: string; // function as string, e.g. "y = sin(x)"
    color?: string;
    stepSize?: number;
    xMin?: number;
    xMax?: number;
    tension?: number;
    showArrows?: boolean;
    width?: number;
  };

  const {
    func,
    color = 'black',
    stepSize = 0.05,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = 0.5,
    showArrows = false,
    width = LINE_WIDTH
  }: ExplicitFunction2DProps = $props();

  // Detect explicit form: y=... or just an expression in x
  let explicitExpr: string = $derived.by(() => {
    const funcStr = func.replace(/\s/g, '');

    if (/^y=/.test(funcStr)) {
      return funcStr.replace(/^y=/, '');
    } else if (!funcStr.includes('=')) {
      return funcStr;
    } else {
      console.error(
        'Implicit functions are not supported in this component. Use ImplicitFunction2D instead.'
      );
      return '';
    }
  });

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const parsed = math.parse(explicitExpr);
    const compiled = parsed.compile();

    const points: Vector2[] = [];
    for (let x = xMin; x <= xMax; x += stepSize) {
      let y: number;
      try {
        y = compiled.evaluate({ x });
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
