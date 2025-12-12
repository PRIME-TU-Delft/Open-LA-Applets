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
    maxSlope?: number;
    curvatureThreshold?: number;
    maxDepth?: number;
    minStep?: number;
    smoothing?: 'cardinal' | 'linear';
  };

  const {
    func,
    color = 'black',
    stepSize = 0.02,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = 0.5,
    showArrows = false,
    width = LINE_WIDTH,
    integral,
    maxSlope = 15,
    curvatureThreshold = 0.05,
    maxDepth = 10,
    minStep = Math.min(stepSize / 20, 0.0015),
    smoothing = 'linear'
  }: ExplicitFunction2DProps = $props();

  // Generate points for the function
  const functionRoots = $derived.by(() => {
    const segments: Vector2[][] = [];
    let currentSegment: Vector2[] = [];

    const pushCurrent = () => {
      if (currentSegment.length > 0) {
        segments.push(currentSegment);
        currentSegment = [];
      }
    };

    const safeVal = (x: number) => {
      try {
        return func(x);
      } catch {
        return NaN;
      }
    };

    const bisectBoundary = (a: number, b: number, targetFinite: boolean) => {
      let lo = a;
      let hi = b;
      for (let i = 0; i < 24 && Math.abs(hi - lo) > minStep / 2; i++) {
        const mid = (lo + hi) / 2;
        const ym = safeVal(mid);
        if (Number.isFinite(ym) === targetFinite) {
          hi = mid;
        } else {
          lo = mid;
        }
      }

      const xStar = targetFinite ? hi : lo;
      const yStar = safeVal(xStar);
      return { x: xStar, y: Number.isFinite(yStar) ? yStar : 0 };
    };

    const refine = (x0: number, y0: number, x1: number, y1: number, depth: number) => {
      if (!isFinite(y1)) {
        pushCurrent();
        return;
      }

      const dx = x1 - x0;
      if (dx <= 0) return;

      if (depth < maxDepth && dx > minStep) {
        const xm = (x0 + x1) / 2;
        let ym: number;
        try {
          ym = func(xm);
        } catch {
          ym = NaN;
        }

        if (isFinite(ym)) {
          const slopeL = Math.abs((ym - y0) / (xm - x0));
          const slopeR = Math.abs((y1 - ym) / (x1 - xm));
          const localCurvature = Math.abs(ym - (y0 + y1) / 2);

          if (slopeL > maxSlope || slopeR > maxSlope || localCurvature > curvatureThreshold) {
            refine(x0, y0, xm, ym, depth + 1);
            refine(xm, ym, x1, y1, depth + 1);
            return;
          }
        }
      }

      currentSegment.push(new Vector2(x1, y1));
    };

    let prevX = xMin;
    let prevY: number | null = null;

    const firstY = (() => {
      const fy = safeVal(prevX);
      return isFinite(fy) ? fy : null;
    })();

    if (firstY !== null) {
      prevY = firstY;
      currentSegment.push(new Vector2(prevX, prevY));
    }

    for (let x = xMin + stepSize; x <= xMax + 1e-9; x += stepSize) {
      const y = safeVal(x);

      if (!isFinite(y)) {
        if (prevY !== null) {
          const boundary = bisectBoundary(prevX, x, false);
          currentSegment.push(new Vector2(boundary.x, 0));
          pushCurrent();
        }
        prevY = null;
        prevX = x;
        continue;
      }

      if (prevY === null) {
        if (x > xMin) {
          const boundary = bisectBoundary(prevX, x, true);
          currentSegment.push(new Vector2(boundary.x, 0));
        }
        currentSegment.push(new Vector2(x, y));
        prevY = y;
        prevX = x;
        continue;
      }

      refine(prevX, prevY, x, y, 0);
      prevX = x;
      prevY = y;
    }

    pushCurrent();

    return segments;
  });

  const curveFactory = $derived(smoothing === 'cardinal' ? curveCardinal.tension(tension) : null);

  const makeLine = () => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y);
    return curveFactory ? l.curve(curveFactory) : l;
  };

  const smoothLines = $derived.by(() => {
    const l = makeLine();
    return functionRoots.map((points) => l(points));
  });

  // Generate points for the integral region
  const integralPath = $derived.by(() => {
    if (!integral) return null;

    const { xLeft, xRight } = integral;
    const segments: Vector2[][] = [];
    let current: Vector2[] = [];

    const safeVal = (x: number) => {
      try {
        return func(x);
      } catch {
        return NaN;
      }
    };

    const pushCurrent = () => {
      if (current.length > 0) {
        segments.push(current);
        current = [];
      }
    };

    const startY = safeVal(xLeft);
    if (isFinite(startY)) current.push(new Vector2(xLeft, startY));

    for (let x = xLeft + stepSize; x < xRight + 1e-9; x += stepSize) {
      const y = safeVal(x);
      if (!isFinite(y)) {
        pushCurrent();
        continue;
      }
      current.push(new Vector2(x, y));
    }

    const endY = safeVal(xRight);
    if (isFinite(endY)) current.push(new Vector2(xRight, endY));
    pushCurrent();

    if (segments.length === 0) return null;

    const l = makeLine();

    // Build separate polygons per finite segment to avoid stitching across gaps
    const paths = segments
      .filter((seg) => seg.length >= 2)
      .map((seg) => {
        const path = l(seg);
        if (!path) return null;
        const last = seg[seg.length - 1];
        const first = seg[0];
        return `${path} L ${last.x},0 L ${first.x},0 Z`;
      })
      .filter((p): p is string => !!p);

    return paths.length > 0 ? paths.join(' ') : null;
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
