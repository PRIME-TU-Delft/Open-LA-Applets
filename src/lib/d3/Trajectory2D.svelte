<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { curveCardinal, line } from 'd3';
  import { Vector2 } from 'three';
  import Point2D from './Point2D.svelte';
  import Triangle2D from './Triangle2D.svelte';
  import { getContext, setContext } from 'svelte';

  type Trajectory2DProps = {
    start: Vector2;
    color?: string;
    width?: number;
    stepSize?: number;
    maxLength?: number;
    tension?: number;
  };

  const {
    start,
    color,
    width,
    stepSize = 0.05,
    maxLength = 100,
    tension = 0.5
  }: Trajectory2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  // Prevent children (Point2D, Triangle2D) from applying scale again
  setContext('scale2D', { x: 1, y: 1 });

  const scaledStart = $derived(new Vector2(start.x * sx, start.y * sy));

  const c1 = $derived(0.25 * scaledStart.x + 0.5 * scaledStart.y);
  const c2 = $derived(0.25 * scaledStart.x - 0.5 * scaledStart.y);
  const v1 = new Vector2(2, 1);
  const v2 = new Vector2(2, -1);

  const trajectoryPoints = $derived.by(() => {
    const points = [scaledStart.clone()];
    let currentPoint = scaledStart.clone();

    function xt(t: number) {
      const vt1 = v1.clone().multiplyScalar(c1 * Math.exp(3 * t));
      const vt2 = v2.clone().multiplyScalar(c2 * Math.exp(-t));
      return vt1.add(vt2);
    }

    let iterations = 1;

    while (iterations < maxLength) {
      // if out of bounds, break
      if (
        Math.abs(currentPoint.x) > 30 ||
        Math.abs(currentPoint.y) > 30 ||
        (Math.abs(currentPoint.x) < 0.05 && Math.abs(currentPoint.y) < 0.05)
      ) {
        break;
      }

      const point = xt(iterations * stepSize);
      const distanceTo = currentPoint.distanceTo(point);

      // If the distance to the next point is too small, skip it (do not draw it)
      if (distanceTo < 0.25) {
        iterations++;
        continue;
      }

      currentPoint = point;

      points.push(currentPoint);
      iterations++;
    }

    return points;
  });

  const smoothLine = $derived.by(() => {
    const l = line<Vector2>()
      .x((d) => d.x)
      .y((d) => d.y)
      // FROM d3 docs - curveCardinal:
      // https://d3js.org/d3-shape/curve#curveCardinal
      // Produces a cubic cardinal spline using the specified control points,
      // with one-sided differences used for the first and last piece.
      // The default tension is 0.
      .curve(curveCardinal.tension(tension));

    return l(trajectoryPoints);
  });
</script>

{#if scaledStart.x / scaledStart.y == -2}
  <Point2D position={new Vector2()} {color} radius={width ? width * 4 : undefined} />
{/if}

{#each trajectoryPoints as point, i (i)}
  {#if i == 0}
    <Point2D position={point} {color} radius={width ? width * 2 : undefined} />
  {:else if i == trajectoryPoints.length - 1}
    {@const lastPoint = trajectoryPoints[i - 1]}
    {@const dir = point.clone().sub(lastPoint).normalize().multiplyScalar(0.5)}
    {@const size = (width ?? 0.5) * 2}

    <g
      transform={`translate(${point.x}, ${point.y}) rotate(${(dir.angle() * 180) / Math.PI - 90})`}
    >
      <Triangle2D
        points={[new Vector2(size, 0), new Vector2(-size, 0), new Vector2(0, size * 2)]}
        {color}
      />
    </g>
  {:else}
    {@const nextPoint = trajectoryPoints[i + 1]}
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

<path d={smoothLine} stroke={color ?? 'black'} stroke-width={width ?? LINE_WIDTH} fill="none" />
