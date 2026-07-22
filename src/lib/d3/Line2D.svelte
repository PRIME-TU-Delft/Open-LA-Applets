<script lang="ts" module>
  import type { Vector2 } from 'three';

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
  import { getProjection2D } from '$lib/utils/Projection2D';

  let { start, end, color = 'black', width = LINE_WIDTH, isDashed = false }: Line2DProps = $props();

  const projection = getProjection2D();
  const startS = $derived(projection.toScreen(start));
  const endS = $derived(projection.toScreen(end));
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
  x1={startS.x}
  y1={startS.y}
  x2={endS.x}
  y2={endS.y}
  stroke={color}
  stroke-width={width}
  stroke-dasharray={isDashed ? `${4 * width} ${4 * width}` : undefined}
/>
