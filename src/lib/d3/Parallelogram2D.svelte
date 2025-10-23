<script lang="ts" module>
  export type Parallelogram2DProps = {
    points: [Vector2, Vector2, Vector2];
    color?: string;
    strokeWidth?: number;
    strokeColor?: string;
    opacity?: number;
    fillStyle?: 'full' | 'dashed';
  };
</script>

<script lang="ts">
  import type { Vector2 } from 'three';

  let {
    points,
    color = 'black',
    strokeColor = 'black',
    strokeWidth = 1,
    opacity = 1,
    fillStyle = 'full'
  }: Parallelogram2DProps = $props();

  const [a, b, c] = $derived(points.map((p) => p.toArray().join(',')));

  const d = $derived(points[1].clone().add(points[2]).sub(points[0]).toArray().join(','));

  const patternId = $derived(`dashed-pattern-${color.replace(/[^a-zA-Z0-9]/g, '')}`);
  const fillValue = $derived(fillStyle === 'dashed' ? `url(#${patternId})` : color);
</script>

<!-- @component
  This component is used to draw a parallelogram in 2D. It needs three points to be defined and will automatically calculate the fourth point.
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
  points="{a} {b} {d} {c} "
/>
