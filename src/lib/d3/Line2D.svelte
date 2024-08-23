<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';

  type Line2DProps = {
    start: Vector2;
    end: Vector2;
    color?: string;
    width?: number;
    isDashed?: boolean;
  };

  let { start, end, color = 'black', width = LINE_WIDTH, isDashed = false }: Line2DProps = $props();
</script>

<line
  x1={start.x}
  y1={start.y}
  x2={end.x}
  y2={end.y}
  stroke={color}
  stroke-width={width}
  stroke-dasharray="{width} {isDashed ? width : 0}"
/>
