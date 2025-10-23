<script lang="ts" module>
  export type Parallelogram2DProps = {
    points: [Vector2, Vector2, Vector2];
    color?: string;
    strokeWidth?: number;
    strokeColor?: string;
    opacity?: number;
  };
</script>

<script lang="ts">
  import type { Vector2 } from 'three';

  let {
    points,
    color = 'black',
    strokeColor = 'black',
    strokeWidth = 1,
    opacity = 1
  }: Parallelogram2DProps = $props();

  const [a, b, c] = $derived(points.map((p) => p.toArray().join(',')));

  const d = $derived(points[1].clone().add(points[2]).sub(points[0]).toArray().join(','));
</script>

<!-- @component
  This component is used to draw a parallelogram in 2D. It needs three points to be defined and will automatically calculate the fourth point.
 -->

<polygon
  fill={color}
  stroke={strokeColor}
  stroke-width={strokeWidth * 0.05}
  {opacity}
  points="{a} {b} {d} {c} "
/>
