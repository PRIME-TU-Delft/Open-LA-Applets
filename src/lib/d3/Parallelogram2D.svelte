<script lang="ts" module>
  import type { Vector2 } from 'three';
  import type { Polygon2DProps } from './Polygon2D.svelte';

  export type Parallelogram2DProps = Omit<Polygon2DProps, 'points' | 'offset'> & {
    points: [Vector2, Vector2, Vector2];
  };
</script>

<script lang="ts">
  import Polygon2D from './Polygon2D.svelte';

  let { points, ...polygonProps }: Parallelogram2DProps = $props();

  const d = $derived(points[1].clone().add(points[2]).sub(points[0]));
</script>

<!-- @component
  This component is used to draw a parallelogram in 2D. It needs three points to be defined and will automatically calculate the fourth point.
 -->

<Polygon2D points={[points[0], points[1], d, points[2]]} {...polygonProps} />
