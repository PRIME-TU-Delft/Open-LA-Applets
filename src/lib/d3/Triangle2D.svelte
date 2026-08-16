<script lang="ts">
  import { Vector2 } from 'three';
  import { getProjection2D } from '$lib/utils/Projection2D';

  export type Triangle2DProps = {
    points: Vector2[];
    color?: string;
  };

  let { points, color = 'black' }: Triangle2DProps = $props();

  const projection = getProjection2D();
  const scaledPoints = $derived(points.map((p) => projection.toScreen(p)));
</script>

<!-- @component
@props
- points: Vector2[] - The points of the triangle.
- color: string - The color of the triangle.

@example
<Triangle points={[new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)]} />
-->

<polygon points={scaledPoints.map((p) => p.x + ',' + p.y).join(' ')} fill={color} />
