<script lang="ts">
  import { Vector2 } from 'three';

  export let points: Vector2[];
  export let color: string = 'black';
  export let strokeColor: string = color;
  export let strokeWidth: number = 1;
  export let opacity: number = 1;
  export let offset: Vector2 = new Vector2(0, 0);

  $: pointsJoin = points.map((p) => p.clone().add(offset).toArray().join(',')).join(' ');
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
