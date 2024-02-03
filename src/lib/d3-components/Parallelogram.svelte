<script lang="ts">
  import type { Vector2 } from 'three';

  export let points: [Vector2, Vector2, Vector2];
  export let color: string = 'black';
  export let strokeWidth: number = 1;

  $: [a, b, c] = points.map((p) => p.toArray().join(','));

  $: d = points[1].clone().add(points[2]).sub(points[0]).toArray().join(',');
</script>

<!-- @component
  This component is used to draw a parallelogram in 2D. It needs three points to be defined and will automatically calculate the fourth point.
 -->

<polygon fill={color} stroke="black" stroke-width={strokeWidth * 0.05} points="{a} {b} {d} {c} " />
