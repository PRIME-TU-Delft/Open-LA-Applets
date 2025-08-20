<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import {
    curveCardinal,
    curveCardinalClosed,
    curveCatmullRomClosed,
    curveCatmullRomOpen,
    line
  } from 'd3';
  import { CatmullRomCurve3, Vector2 } from 'three';
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

  class StartEndLine {
    start: Vector2;
    end: Vector2;
    points: Vector2[];

    constructor(start: Vector2, end: Vector2) {
      this.start = start;
      this.end = end;
      this.points = [start, end];
    }

    private startDistance(other: Vector2): number {
      return this.start.distanceTo(other);
    }

    private endDistance(other: Vector2): number {
      return this.end.distanceTo(other);
    }

    addEdge([start, end]: [Vector2, Vector2]): boolean {
      if (this.startDistance(start) < 0.001) {
        // prepend to start
        this.points.unshift(end);
        this.start = end;
        return true;
      } else if (this.startDistance(end) < 0.001) {
        // prepend to start
        this.points.unshift(start);
        this.start = start;
        return true;
      } else if (this.endDistance(start) < 0.001) {
        // append to end
        this.points.push(end);
        this.end = end;
        return true;
      } else if (this.endDistance(end) < 0.001) {
        // append to end
        this.points.push(start);
        this.end = start;
        return true;
      }

      return false;
    }

    canMerge(other: StartEndLine): boolean {
      // Check if the start or end points are close enough
      return (
        this.startDistance(other.start) < 0.001 ||
        this.startDistance(other.end) < 0.001 ||
        this.endDistance(other.start) < 0.001 ||
        this.endDistance(other.end) < 0.001
      );
    }

    merge(other: StartEndLine): void {
      // Merge points from the other line
      if (this.startDistance(other.start) < 0.001) {
        this.points.unshift(...other.points);
        this.start = other.start;
      } else if (this.startDistance(other.end) < 0.001) {
        this.points.unshift(...other.points.reverse());
        this.start = other.end;
      } else if (this.endDistance(other.start) < 0.001) {
        this.points.push(...other.points);
        this.end = other.start;
      } else if (this.endDistance(other.end) < 0.001) {
        this.points.push(...other.points.reverse());
        this.end = other.end;
      }
    }

    get length(): number {
      return this.start.distanceTo(this.end);
    }
  }

  const {
    zeroFunc,
    color = 'black',
    stepSize = 0.5,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = -0.5,
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
    const lines: StartEndLine[] = [];

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
          // Check if it can be added to any StartEndLine
          let canBeAdded = false;
          const s = edges[start];
          const e = edges[end];
          for (const line of lines) {
            if (line.addEdge([s, e])) {
              canBeAdded = true;
              break;
            }
          }

          if (!canBeAdded) {
            // Create a new StartEndLine if it cannot be added
            const newLine = new StartEndLine(s, e);
            lines.push(newLine);
          }
        }
      }
    }

    // Merge lines if possible
    for (const line of lines) {
      // Check if the line can be merged with any existing line
      for (const other of lines) {
        if (line !== other && line.canMerge(other)) {
          line.merge(other);
          // remove other from the list of lines
          lines.splice(lines.indexOf(other), 1);
          break;
        }
      }
    }

    console.log({ lines });

    return lines;
  });

  const smoothLines = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(curveCardinal.tension(tension));

    return contourLines.map((line) => l(line.points));
  });
</script>

{#if showArrows}
  {#each contourLines as line, lineIdx (lineIdx)}
    {#if line.length >= 2}
      {@const midIdx = Math.floor(line.points.length / 2)}
      {@const point = line.points[midIdx]}
      {@const nextPoint = line.points[Math.min(midIdx + 1, line.points.length - 1)]}
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
