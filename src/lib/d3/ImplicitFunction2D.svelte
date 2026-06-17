<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import { getContext, setContext } from 'svelte';

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
    width?: number;
    isDashed?: boolean;
    maxDepth?: number;
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
        this.points.unshift(...other.points.reverse().slice(0, -1));
        this.start = other.end;
      } else if (this.startDistance(other.end) < 0.001) {
        this.points.unshift(...other.points.slice(0, -1));
        this.start = other.start;
      } else if (this.endDistance(other.start) < 0.001) {
        this.points = [...this.points.slice(0, -1), ...other.points];
        this.end = other.end;
      } else if (this.endDistance(other.end) < 0.001) {
        this.points = [...this.points.slice(0, -1), ...other.points.reverse()];
        this.end = other.start;
      }
    }

    get length(): number {
      return this.start.distanceTo(this.end);
    }
  }

  const {
    zeroFunc,
    color = 'black',
    stepSize = 0.15,
    xMin = -GRID_SIZE_2D,
    xMax = GRID_SIZE_2D,
    tension = -0.5,
    yMin = -GRID_SIZE_2D,
    yMax = GRID_SIZE_2D,
    width = LINE_WIDTH,
    isDashed = false,
    maxDepth = 6
  }: ImplicitFunction2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  setContext('scale2D', { x: 1, y: 1 });

  const worldXMin = $derived(xMin * sx);
  const worldXMax = $derived(xMax * sx);
  const worldYMin = $derived(yMin * sy);
  const worldYMax = $derived(yMax * sy);

  function interpolate(p1: Vector2, p2: Vector2, v1: number, v2: number): Vector2 {
    if (Math.abs(v1 - v2) < 1e-10) return p1.clone();
    const t = -v1 / (v2 - v1);
    return p1.clone().lerp(p2, t);
  }

  // Helper function to evaluate function with caching
  function getOrEvalFunc(valueCache: Map<string, number>, x: number, y: number): number {
    const key = `${x},${y}`;
    if (valueCache.has(key)) {
      return valueCache.get(key)!;
    }
    try {
      const val = zeroFunc(x / sx, y / sy);
      const result = isFinite(val) ? val : 0;
      valueCache.set(key, result);
      return result;
    } catch {
      valueCache.set(key, 0);
      return 0;
    }
  }

  // Detect if a cell needs refinement based on curvature
  function needsRefinement(
    v00: number,
    v10: number,
    v01: number,
    v11: number,
    cellSize: number
  ): boolean {
    // Check for zero crossing
    const hasZeroCrossing =
      (v00 > 0 && v10 < 0) ||
      (v00 < 0 && v10 > 0) ||
      (v10 > 0 && v11 < 0) ||
      (v10 < 0 && v11 > 0) ||
      (v11 > 0 && v01 < 0) ||
      (v11 < 0 && v01 > 0) ||
      (v01 > 0 && v00 < 0) ||
      (v01 < 0 && v00 > 0);

    if (!hasZeroCrossing) return false;

    // Don't refine cells that are already at minimum size
    // Use a reasonable minimum based on stepSize
    const minCellSize = stepSize / Math.pow(2, 5); // ~3% of original stepSize
    if (cellSize <= minCellSize) return false;

    // For cells with zero crossing, always refine until hitting minimum
    return true;
  }

  // Recursive function to process cells with adaptive refinement
  function marchingSquaresAdaptive(
    lines: StartEndLine[],
    valueCache: Map<string, number>,
    xStart: number,
    yStart: number,
    currentStepSize: number,
    maxDepth: number
  ): void {
    const x = xStart;
    const y = yStart;

    // Get the four corner values
    const p00 = new Vector2(x, y);
    const p10 = new Vector2(x + currentStepSize, y);
    const p01 = new Vector2(x, y + currentStepSize);
    const p11 = new Vector2(x + currentStepSize, y + currentStepSize);

    const v00 = getOrEvalFunc(valueCache, x / sx, y / sy);
    const v10 = getOrEvalFunc(valueCache, (x + currentStepSize) / sx, y / sy);
    const v01 = getOrEvalFunc(valueCache, x / sx, (y + currentStepSize) / sy);
    const v11 = getOrEvalFunc(valueCache, (x + currentStepSize) / sx, (y + currentStepSize) / sy);

    // Create marching squares case
    let caseIndex = 0;
    if (v00 > 0) caseIndex |= 1;
    if (v10 > 0) caseIndex |= 2;
    if (v11 > 0) caseIndex |= 4;
    if (v01 > 0) caseIndex |= 8;

    // Skip if all same sign or zero
    if (caseIndex === 0 || caseIndex === 15) return;

    // Check if this cell needs refinement and we still have depth to refine
    if (needsRefinement(v00, v10, v01, v11, currentStepSize) && maxDepth > 0) {
      // Subdivide into 4 quadrants
      const halfStep = currentStepSize / 2;
      marchingSquaresAdaptive(lines, valueCache, x, y, halfStep, maxDepth - 1);
      marchingSquaresAdaptive(lines, valueCache, x + halfStep, y, halfStep, maxDepth - 1);
      marchingSquaresAdaptive(lines, valueCache, x, y + halfStep, halfStep, maxDepth - 1);
      marchingSquaresAdaptive(
        lines,
        valueCache,
        x + halfStep,
        y + halfStep,
        halfStep,
        maxDepth - 1
      );
      return;
    }

    // Apply standard marching squares
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

  // Marching squares algorithm with adaptive refinement
  const contourLines = $derived.by(() => {
    const lines: StartEndLine[] = [];
    const valueCache = new Map<string, number>();

    let xPos = worldXMin;
    while (xPos < worldXMax) {
      let yPos = worldYMin;
      while (yPos < worldYMax) {
        // Calculate actual cell size (may be smaller at boundaries)
        const currentStepSize = Math.min(stepSize, worldXMax - xPos, worldYMax - yPos);

        marchingSquaresAdaptive(lines, valueCache, xPos, yPos, currentStepSize, maxDepth);

        yPos += stepSize;
      }
      xPos += stepSize;
    }

    // Merge connected lines
    let merged = true;
    while (merged) {
      merged = false;
      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          if (lines[i].canMerge(lines[j])) {
            lines[i].merge(lines[j]);
            lines.splice(j, 1);
            merged = true;
            break;
          }
        }
        if (merged) break;
      }
    }

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

{#each smoothLines as d, idx (idx)}
  {#if d}
    <path
      {d}
      stroke={color}
      stroke-width={width ?? LINE_WIDTH}
      fill="none"
      stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
    />
  {/if}
{/each}

<!-- debug: show all points
{#each contourLines as line, lineIdx (lineIdx)}
  {#each line.points as point, pointIdx (pointIdx)}
    <Point2D
      position={new Vector2(point.x, point.y)}
      color={PrimeColor.black}
      radius={0.03}
    />
  {/each}
{/each} -->
