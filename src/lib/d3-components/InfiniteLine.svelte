<script lang="ts">
  import { LINE_WIDTH } from '$lib/utils/AttributeDimensions';
  import { Vector2 } from 'three';
    import Vector from './stories/Vector.stories.svelte';

  export let origin: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';
  export let width: number = LINE_WIDTH;
  export let isDashed = false;
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
