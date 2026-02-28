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
    discontinuitySlope?: number;
    discontinuityMagnitude?: number;
    verticalLimit?: number;
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
    minStep = Math.min(stepSize / 40, 0.001),
    smoothing = 'linear',
    discontinuitySlope = maxSlope * 5000,
    discontinuityMagnitude = 1e6,
    verticalLimit = GRID_SIZE_2D
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

    // Returns true when the segment is intentionally split to avoid bridging a discontinuity
    const refine = (x0: number, y0: number, x1: number, y1: number, depth: number): boolean => {
      if (!isFinite(y1)) {
        pushCurrent();
        return true;
      }

      const dx = x1 - x0;
      if (dx <= 0) return false;

      const slope = Math.abs((y1 - y0) / dx);

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
            if (refine(x0, y0, xm, ym, depth + 1)) return true;
            if (refine(xm, ym, x1, y1, depth + 1)) return true;
            return false;
          }
        }
      }

      if (
        slope > discontinuitySlope ||
        Math.abs(y0) > discontinuityMagnitude ||
        Math.abs(y1) > discontinuityMagnitude ||
        Math.abs(y0) > verticalLimit ||
        Math.abs(y1) > verticalLimit
      ) {
        pushCurrent();
        return true;
      }

      currentSegment.push(new Vector2(x1, y1));
      return false;
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
          pushCurrent();
        }
        prevY = null;
        prevX = x;
        continue;
      }

      if (prevY === null) {
        currentSegment.push(new Vector2(x, y));
        prevY = y;
        prevX = x;
        continue;
      }

      const split = refine(prevX, prevY, x, y, 0);
      if (split) {
        prevX = x;
        prevY = null;
        continue;
      }

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

  const visibleSegments = $derived.by(() => functionRoots.filter((seg) => seg.length >= 2));

  const smoothLines = $derived.by(() => {
    const l = makeLine();
    return visibleSegments.map((points) => l(points));
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
  {#each visibleSegments as points, rootIdx (rootIdx)}
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
