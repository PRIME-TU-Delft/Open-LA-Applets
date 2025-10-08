<script lang="ts">
  import { Vector2 } from 'three';

  export type Rectangle2DProps = {
    points: [Vector2, Vector2];
    color?: string;
  };

  let { points, color = 'black' }: Rectangle2DProps = $props();
</script>

<!-- @component
@props
- points: Vector2[] - Two opposite-corner points of the rectangle.
- color: string - The color of the rectangle.

@example
<Rectangle points={[new Vector2(0, 0), new Vector2(1, 1)]} />
-->

<polygon
  points={`
    ${points[0].x},${points[0].y}
    ${points[1].x},${points[0].y}
    ${points[1].x},${points[1].y}
    ${points[0].x},${points[1].y}
  `} fill={color} />