<script lang="ts">
  import { Vector2 } from 'three';

  export type Polygon2DProps = {
    points: Vector2[];
    color?: string;
    strokeColor?: string;
    strokeWidth?: number;
    opacity?: number;
    offset?: Vector2;
    fillStyle?: 'full' | 'dashed';
  };

  let {
    points,
    color = 'black',
    strokeColor = color,
    strokeWidth = 1,
    opacity = 1,
    offset = new Vector2(0, 0),
    fillStyle = 'full'
  }: Polygon2DProps = $props();

  // Points joined by commas [(1,0,), (0,1)] => "1,0 0,1"
  const pointsJoin = $derived(
    points.map((p) => p.clone().add(offset).toArray().join(',')).join(' ')
  );

  const patternId = $derived(`dashed-pattern-${color.replace(/[^a-zA-Z0-9]/g, '')}`);
  const fillValue = $derived(fillStyle === 'dashed' ? `url(#${patternId})` : color);
</script>

<!-- @component
  This component is used to draw a poligon in 2D. It needs n points in clockwise or anti-clockwise order to be defined.
 -->

{#if fillStyle === 'dashed'}
  <defs>
    <pattern
      id={patternId}
      patternUnits="userSpaceOnUse"
      width="0.08"
      height="0.08"
      patternTransform="rotate(45)"
    >
      <line x1="0" y1="0" x2="0" y2="0.08" stroke={color} stroke-width="0.03" />
    </pattern>
  </defs>
{/if}

<polygon
  fill={fillValue}
  stroke={strokeColor}
  stroke-width={strokeWidth * 0.05}
  {opacity}
  points={pointsJoin}
/>
