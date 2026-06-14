<script lang="ts">
  import { Vector2 } from 'three';
  import { getContext } from 'svelte';

  export type Triangle2DProps = {
    points: Vector2[];
    color?: string;
  };

  let { points, color = 'black' }: Triangle2DProps = $props();

  const _scale2D = getContext('scale2D') as { x: number; y: number } | undefined;
  const sx = _scale2D?.x ?? 1;
  const sy = _scale2D?.y ?? 1;
  const scaledPoints = $derived(points.map((p) => new Vector2(p.x * sx, p.y * sy)));
</script>

<!-- @component
@props
- points: Vector2[] - The points of the triangle.
- color: string - The color of the triangle.

@example
<Triangle points={[new Vector2(0, 0), new Vector2(1, 0), new Vector2(0, 1)]} />
-->

<polygon points={scaledPoints.map((p) => p.x + ',' + p.y).join(' ')} fill={color} />
