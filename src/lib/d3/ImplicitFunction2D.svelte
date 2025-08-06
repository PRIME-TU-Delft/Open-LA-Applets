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

  function interpolate(p1: Vector2, p2: Vector2, v1: number, v2: number): Vector2 {
    if (Math.abs(v1 - v2) < 1e-10) return p1.clone();
    const t = -v1 / (v2 - v1);
    return p1.clone().lerp(p2, t);
  }

  // Marching squares algorithm to find contour lines
  const contourLines = $derived.by(() => {
    const lines: Vector2[][] = [];

    const gridWidth = Math.ceil((xMax - xMin) / stepSize);
    const gridHeight = Math.ceil((yMax - yMin) / stepSize);

    const values: number[][] = [];
    for (let i = 0; i <= gridWidth; i++) {
      values[i] = [];
      for (let j = 0; j <= gridHeight; j++) {
        const x = xMin + i * stepSize;
        const y = yMin + j * stepSize;
        try {
          const val = zeroFunc(x, y);
          values[i][j] = isFinite(val) ? val : 0;
        } catch {
          values[i][j] = 0;
        }
      }
    }

    for (let i = 0; i < gridWidth; i++) {
      for (let j = 0; j < gridHeight; j++) {
        const x = xMin + i * stepSize;
        const y = yMin + j * stepSize;

        // Get the four corner values
        const v00 = values[i][j];
        const v10 = values[i + 1][j];
        const v01 = values[i][j + 1];
        const v11 = values[i + 1][j + 1];

        // Create marching squares case
        let caseIndex = 0;
        if (v00 > 0) caseIndex |= 1;
        if (v10 > 0) caseIndex |= 2;
        if (v11 > 0) caseIndex |= 4;
        if (v01 > 0) caseIndex |= 8;

        // Skip if all same sign or zero
        if (caseIndex === 0 || caseIndex === 15) continue;

        // Corner points
        const p00 = new Vector2(x, y);
        const p10 = new Vector2(x + stepSize, y);
        const p01 = new Vector2(x, y + stepSize);
        const p11 = new Vector2(x + stepSize, y + stepSize);

        // Edge midpoints (interpolated)
        const edges: Vector2[] = [];
        edges[0] = interpolate(p00, p10, v00, v10); // bottom edge
        edges[1] = interpolate(p10, p11, v10, v11); // right edge
        edges[2] = interpolate(p01, p11, v01, v11); // top edge
        edges[3] = interpolate(p00, p01, v00, v01); // left edge

        // Determine line segments based on case
        const segments: [number, number][] = [];
        switch (caseIndex) {
          case 1:
          case 14:
            segments.push([3, 0]);
            break;
          case 2:
          case 13:
            segments.push([0, 1]);
            break;
          case 3:
          case 12:
            segments.push([3, 1]);
            break;
          case 4:
          case 11:
            segments.push([1, 2]);
            break;
          case 5:
            segments.push([3, 0], [1, 2]);
            break;
          case 6:
          case 9:
            segments.push([0, 2]);
            break;
          case 7:
          case 8:
            segments.push([3, 2]);
            break;
          case 10:
            segments.push([3, 1], [0, 2]);
            break;
        }

        for (const [start, end] of segments) {
          lines.push([edges[start], edges[end]]);
        }
      }
    }

    return lines;
  });

  const smoothLines = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));

    return contourLines.map((points) => l(points));
  });
</script>

{#if showArrows}
  {#each contourLines as points, lineIdx (lineIdx)}
    {#if points.length >= 2}
      {@const midIdx = Math.floor(points.length / 2)}
      {@const point = points[midIdx]}
      {@const nextPoint = points[Math.min(midIdx + 1, points.length - 1)]}
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
{/if}

{#each smoothLines as d, idx (idx)}
  {#if d}
    <path {d} stroke={color ?? 'black'} stroke-width={width ?? LINE_WIDTH} fill="none" />
  {/if}
{/each}
