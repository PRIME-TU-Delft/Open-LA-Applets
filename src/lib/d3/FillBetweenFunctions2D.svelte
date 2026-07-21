<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { line } from 'd3';
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { getContext } from 'svelte';

  export type FillBetweenFunctions2DProps = {
    func1: (x: number) => number;
    func2: (x: number) => number;
    color1?: string;
    color2?: string;
    stepSize?: number;
    xMin?: number;
    xMax?: number;
    width?: number;
    integral?: { xLeft: number; xRight: number; fillStyle: 'full' | 'dashed'; color?: string };
  };

  const {
    func1,
    func2,
    color1 = 'black',
    color2 = 'black',
    stepSize = 0.02,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    width = LINE_WIDTH,
    integral
  }: FillBetweenFunctions2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;

  const safeVal1 = (x: number) => {
    try {
      return func1(x / sx) * sy;
    } catch {
      return NaN;
    }
  };

  const safeVal2 = (x: number) => {
    try {
      return func2(x / sx) * sy;
    } catch {
      return NaN;
    }
  };

  const lineGen = line<Vector2>()
    .x((d) => d.x)
    .y((d) => d.y);

  // Generate points for a function over a given range
  const buildPoints = (safeVal: (x: number) => number, from: number, to: number): Vector2[] => {
    const pts: Vector2[] = [];
    const startY = safeVal(from);
    if (isFinite(startY)) pts.push(new Vector2(from, startY));
    for (let x = from + stepSize; x < to + 1e-9; x += stepSize) {
      const y = safeVal(x);
      if (isFinite(y)) pts.push(new Vector2(x, y));
    }
    const endY = safeVal(to);
    if (isFinite(endY) && (pts.length === 0 || Math.abs(pts[pts.length - 1].x - to) > 1e-9)) {
      pts.push(new Vector2(to, endY));
    }
    return pts;
  };

  // Function curves from xMin to xMax
  const func1Points = $derived(buildPoints(safeVal1, xMin * sx, xMax * sx));
  const func2Points = $derived(buildPoints(safeVal2, xMin * sx, xMax * sx));

  const func1Line = $derived(func1Points.length >= 2 ? lineGen(func1Points) : null);
  const func2Line = $derived(func2Points.length >= 2 ? lineGen(func2Points) : null);

  // Fill path between the two functions over the integral range
  const fillPath = $derived.by(() => {
    if (!integral) return null;

    const xLeft = integral.xLeft * sx;
    const xRight = integral.xRight * sx;

    if (xLeft >= xRight) return null;

    // Forward along func1 (left → right)
    const topPts = buildPoints(safeVal1, xLeft, xRight);
    // Backward along func2 (right → left)
    const botPts = buildPoints(safeVal2, xLeft, xRight).reverse();

    if (topPts.length < 2 || botPts.length < 2) return null;

    const pathTop = lineGen(topPts);
    const pathBot = lineGen(botPts);
    if (!pathTop || !pathBot) return null;

    // Replace the leading "M" of pathBot with "L" so it continues from the
    // end of pathTop instead of starting a new disconnected subpath.
    return `${pathTop} ${pathBot.replace(/^M/, 'L')} Z`;
  });

  const fillColor = $derived(integral?.color ?? color1);
  const patternId = $derived(`fill-between-pattern-${fillColor.replace(/[^a-zA-Z0-9]/g, '')}`);
  const fillValue = $derived(
    integral?.fillStyle === 'dashed' ? `url(#${patternId})` : fillColor + PrimeColor.opacity(0.5)
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
      <line x1="0" y1="0" x2="0" y2="0.08" stroke={fillColor} stroke-width="0.03" />
    </pattern>
  </defs>
{/if}

<!-- Fill between the two functions -->
{#if fillPath}
  <path d={fillPath} fill={fillValue} stroke="none" />
{/if}

<!-- Function curves -->
{#if func1Line}
  <path d={func1Line} stroke={color1} stroke-width={width} fill="none" />
{/if}
{#if func2Line}
  <path d={func2Line} stroke={color2} stroke-width={width} fill="none" />
{/if}
