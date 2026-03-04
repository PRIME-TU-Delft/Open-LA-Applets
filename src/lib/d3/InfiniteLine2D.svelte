<script lang="ts" module>
  export type InfiniteLine2DProps = {
    origin?: Vector2;
    direction?: Vector2;
    color?: string;
    width?: number;
    isDashed?: boolean;
  };
</script>

<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';

  let {
    origin = new Vector2(0, 0),
    direction = new Vector2(1, 1),
    color = 'black',
    width = LINE_WIDTH,
    isDashed = false
  }: InfiniteLine2DProps = $props();

  const dir = $derived(direction.clone().normalize());
  const start = $derived(dir.clone().multiplyScalar(GRID_SIZE_2D).add(origin));
  const end = $derived(
    dir
      .clone()
      .multiplyScalar(GRID_SIZE_2D * -1)
      .add(origin)
  );
</script>

<!-- @component
@props
- origin: Vector2 - The origin of the line.
- direction: Vector2 - The direction of the line.
- color: string - The color of the line.
- width: number - The width of the line.
- isDashed: boolean - Whether the line is dashed or not.

@example
<InfiniteLine2D origin={new Vector2(1, 1)} direction={new Vector2(1, 0)} />
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
