<script lang="ts">
  import { Vector2 } from 'three';

  export type Rectangle2DProps = {
    points: [Vector2, Vector2];
    color?: string;
    hoverText?: string;
    fontSize?: number;
  };

  let { points, color = 'black' }: Rectangle2DProps = $props();
</script>

<polygon
  points={`
    ${points[0].x},${points[0].y}
    ${points[1].x},${points[0].y}
    ${points[1].x},${points[1].y}
    ${points[0].x},${points[1].y}
  `}
  fill={color}
  class="rect-polygon"
></polygon>
