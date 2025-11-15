<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import Triangle2D from './Triangle2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  export type ExplicitFunction2DProps = {
    func: (x: number) => number;
    color?: string;
    stepSize?: number;
    xMin?: number;
    xMax?: number;
    tension?: number;
    showArrows?: boolean;
    width?: number;
    integral?: { xLeft: number; xRight: number; fillStyle: 'full' | 'dashed' };
  };

  const {
    func,
    color = 'black',
    stepSize = 0.05,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = 0.5,
    showArrows = false,
    width = LINE_WIDTH,
    integral
  }: ExplicitFunction2DProps = $props();

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const segments: Vector2[][] = [];
    let currentSegment: Vector2[] = [];
    let prevY: number | null = null;

    const maxSlopeThreshold = 100;

    for (let x = xMin; x <= xMax; x += stepSize) {
      let y: number;
      try {
        y = func(x);
        if (!isFinite(y)) {
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
          prevY = null;
          continue;
        }
      } catch {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
        prevY = null;
        continue;
      }

      if (prevY !== null) {
        const slope = Math.abs((y - prevY) / stepSize);
        if (slope > maxSlopeThreshold) {
          if (currentSegment.length > 0) {
            segments.push(currentSegment);
            currentSegment = [];
          }
        }
      }

      currentSegment.push(new Vector2(x, y));
      prevY = y;
    }

    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    return segments;
  });

  const smoothLines = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));
    return functionRoots.map((points) => l(points));
  });

  // Generate points for the integral region
  const integralPath = $derived.by(() => {
    if (!integral) return null;

    const points: Vector2[] = [];
    const { xLeft, xRight } = integral;

    try {
      const yLeft = func(xLeft);
      if (isFinite(yLeft)) {
        points.push(new Vector2(xLeft, yLeft));
      }
    } catch {
      // continue
    }

    for (let x = xLeft + stepSize; x < xRight; x += stepSize) {
      let y: number;
      try {
        y = func(x);
        if (!isFinite(y)) continue;
      } catch {
        continue;
      }
      points.push(new Vector2(x, y));
    }

    try {
      const yRight = func(xRight);
      if (isFinite(yRight)) {
        points.push(new Vector2(xRight, yRight));
      }
    } catch {
      // continue
    }

    if (points.length === 0) return null;

    // Create smooth curve for the function part
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));

    const curvePath = l(points);

    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];

    return `${curvePath} L ${lastPoint.x},0 L ${firstPoint.x},0 Z`;
  });

  const patternId = $derived(`dashed-pattern-${color.replace(/[^a-zA-Z0-9]/g, '')}`);
  const integralFillValue = $derived(
    integral?.fillStyle === 'dashed' ? `url(#${patternId})` : color + PrimeColor.opacity(0.5)
  );
</script>

{#if integral?.fillStyle === 'dashed'}
  <defs>
    <pattern
      id={patternId}
      patternUnits="userSpaceOnUse"
      width="0.08"
      height="0.08"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="0.08" stroke={color} stroke-width="0.03" />
    </pattern>
  </defs>
{/if}

<!-- Integral region -->
{#if integralPath}
  <path d={integralPath} fill={integralFillValue} stroke="none" />
{/if}

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
