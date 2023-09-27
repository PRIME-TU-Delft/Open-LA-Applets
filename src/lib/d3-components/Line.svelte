<script lang="ts">
  import { Vector2 } from 'three';

  export let start: Vector2 = new Vector2(0, 0);
  export let end: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';
  export let width: number = 1;
  export let isDashed = false;
</script>

<line
  x1={start.x}
  y1={start.y}
  x2={end.x}
  y2={end.y}
  stroke={color}
  stroke-width={width}
  stroke-dasharray="{width} {isDashed ? width / 2 : 0}"
/>
