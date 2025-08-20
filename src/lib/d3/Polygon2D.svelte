<script lang="ts">
  import { Vector2 } from 'three';

  export type Polygon2DProps = {
    points: Vector2[];
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    offset?: Vector2;
  };

  let {
    points,
    color = 'black',
    strokeColor = color,
    strokeWidth = 1,
    opacity = 1,
    offset = new Vector2(0, 0)
  }: Polygon2DProps = $props();

  // Points joined by commas [(1,0,), (0,1)] => "1,0 0,1"
  const pointsJoin = $derived(
    points.map((p) => p.clone().add(offset).toArray().join(',')).join(' ')
  );
</script>

<!-- @component
  This component is used to draw a poligon in 2D. It needs n points in clockwise or anti-clockwise order to be defined.
 -->

<polygon
  fill={color}
  stroke={strokeColor}
  stroke-width={strokeWidth * 0.05}
  {opacity}
  points={pointsJoin}
/>
