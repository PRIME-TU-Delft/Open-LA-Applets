<script lang="ts">
  import { GRID_SIZE_2D, LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
  export let origin: Vector2 = new Vector2(0, 0);
  export let direction: Vector2 = new Vector2(1, 1);
  export let color: string = 'black';
  export let width: number = LINE_WIDTH;
  export let isDashed = false;

  $: dir = direction.clone().normalize();
  $: start = dir
    .clone()
    .multiplyScalar(GRID_SIZE_2D * 2)
    .add(origin);
  $: end = dir
    .clone()
    .multiplyScalar(GRID_SIZE_2D * -2)
    .add(origin);

  //default grid size = 30 (in each dir)
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
