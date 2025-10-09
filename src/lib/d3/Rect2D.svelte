<script lang="ts">
  import { Vector2 } from 'three';

  export type Rectangle2DProps = {
    points: [Vector2, Vector2];
    color?: string;
    hoverText?: string;
    fontSize?: number;
  };

  let { points, color = 'black', hoverText, fontSize = 0.5 }: Rectangle2DProps = $props();

  const hoverPosition = $derived(
    new Vector2(Math.max(points[0].x, points[1].x), Math.max(points[0].y, points[1].y))
  );
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

<!-- TODO: add latex2D component -->
{#if hoverText}
  <g
    transform="translate({hoverPosition.x}, {hoverPosition.y}) scale({0.02 * fontSize},{-0.02 *
      fontSize})"
  >
    <text
      x={(points[0].x + points[1].x) / 2}
      y={Math.max(points[0].y, points[1].y) + 0.3}
      text-anchor="middle"
      class="rect-tooltip"
      aria-hidden="true"
    >
      {hoverText}
    </text>
  </g>
{/if}

<style>
  .rect-tooltip {
    opacity: 0;
    pointer-events: none;
    user-select: none;
  }

  .rect-polygon:hover + g .rect-tooltip {
    opacity: 1;
    pointer-events: none;
  }
  .rect-polygon:hover {
    cursor: pointer;
  }
</style>
