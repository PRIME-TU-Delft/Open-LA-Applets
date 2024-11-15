<script lang="ts" module>
  export type Line2DProps = {
    start: Vector2;
    end: Vector2;
    color?: string;
    width?: number;
    isDashed?: boolean;
  };
</script>

<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';

  let { start, end, color = 'black', width = LINE_WIDTH, isDashed = false }: Line2DProps = $props();
</script>

<!-- @component
@props
- start: Vector2 - The start of the line.
- end: Vector2 - The end of the line.
- color: string - The color of the line.
- width: number - The width of the line.
- isDashed: boolean - Whether the line is dashed or not.

@example
<Line2D start={new Vector2(1, 1)} end={new Vector2(2, 2)} />

-->

<line
  x1={start.x}
  y1={start.y}
  x2={end.x}
  y2={end.y}
  stroke={color}
  stroke-width={width}
  stroke-dasharray="{width} {isDashed ? width : 0}"
/>
