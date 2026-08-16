<script lang="ts">
  import { Vector2 } from 'three';
  import { getProjection2D } from '$lib/utils/Projection2D';

  export type Rectangle2DProps = {
    points: [Vector2, Vector2];
    color?: string;
  };

  let { points, color = 'black' }: Rectangle2DProps = $props();

  const projection = getProjection2D();
  const p0 = $derived(projection.toScreen(points[0]));
  const p1 = $derived(projection.toScreen(points[1]));
</script>

<polygon
  points={`
    ${p0.x},${p0.y}
    ${p1.x},${p0.y}
    ${p1.x},${p1.y}
    ${p0.x},${p1.y}
  `}
  fill={color}
  class="rect-polygon"
></polygon>
