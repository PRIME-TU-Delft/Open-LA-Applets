<script lang="ts" module>
  export type Angle2DProps = {
    color?: string;
    startAngle?: number;
    endAngle?: number;
    origin?: Vector2;
    width?: number;
    distance?: number;
    hasHead?: boolean;
    headLength?: number;
  };
</script>

<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { arc } from 'd3';
  import { Vector2 } from 'three';
  import { getContext } from 'svelte';
  import Triangle2D from './Triangle2D.svelte';

  let {
    color = PrimeColor.black,
    startAngle = 0,
    endAngle = 0,
    origin = new Vector2(0, 0),
    width = LINE_WIDTH,
    distance = 0.8,
    hasHead = false,
    headLength = undefined
  }: Angle2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  const scaledOrigin = $derived(new Vector2(origin.x * sx, origin.y * sy));

  const CONE_HEIGHT = $derived(headLength !== undefined ? headLength : Math.max(7 * width, 0.4));
  const CONE_DIAMETER = $derived(Math.max(1.5 * width, 0.1));

  const inverted = $derived.by(() => startAngle > endAngle);
  const rotation = $derived.by(() => {
    let angle = 90;

    return angle;
  });

  const headAngleOffset = $derived(
    hasHead ? (inverted ? -CONE_HEIGHT : CONE_HEIGHT) / Math.max(distance, 1e-6) : 0
  );
  // Slightly reduce the angle of the arc to force a minimal overlap with the arrowhead
  const endAngleCalculated = $derived(endAngle - 0.95 * headAngleOffset);
  const headAngleOffsetDeg = $derived(((headAngleOffset / Math.PI) * 180) / 2);

  let d = $derived.by(() => {
    return arc()({
      innerRadius: distance - width / 2,
      outerRadius: distance + width / 2,
      startAngle: startAngle,
      endAngle: endAngleCalculated
    });
  });
</script>

<!-- @component
@name Angle2D
@description
  A component that renders an angle between two vectors.
@props
  - color: string - The color of the angle.
  - startAngle: number - The start angle of the angle.
  - endAngle: number - The end angle of the angle.
  - origin: Vector2 - The origin of the angle.
  - width: number - The width of the angle.
  - distance: number - The distance of the angle from the origin.
  - hasHead: boolean - Whether the angle has a head.
@example
<Angle2D startAngle={0} endAngle={Math.PI / 2} />

-->

<g transform="translate({scaledOrigin.x}, {scaledOrigin.y}) rotate({rotation})">
  <path {d} fill={color} />

  {#if hasHead}
    <g
      transform="rotate({(endAngle / Math.PI) * 180 -
        90}) translate({distance}, 0) rotate({-headAngleOffsetDeg}) rotate({inverted ? 180 : 0})"
    >
      <Triangle2D
        points={[
          new Vector2(CONE_DIAMETER, -CONE_HEIGHT),
          new Vector2(-CONE_DIAMETER, -CONE_HEIGHT),
          new Vector2(0, 0)
        ]}
        {color}
      />
    </g>
  {/if}
</g>
