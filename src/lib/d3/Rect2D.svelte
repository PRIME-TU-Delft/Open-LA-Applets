<script lang="ts">
  import { Vector2 } from 'three';
  import { getContext } from 'svelte';

  export type Rectangle2DProps = {
    points: [Vector2, Vector2];
    color?: string;
  };

  let { points, color = 'black' }: Rectangle2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  const p0 = $derived(new Vector2(points[0].x * sx, points[0].y * sy));
  const p1 = $derived(new Vector2(points[1].x * sx, points[1].y * sy));
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
