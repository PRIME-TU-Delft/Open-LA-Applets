<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { Vector2 } from 'three';

  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  export let start: Vector2 = new Vector2(0, 0);
  export let end: Vector2 = new Vector2(0, 0);
  export let color: string = 'black';
  export let width: number = 1;

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  const key = Symbol('line');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(width / $scale);

    p5.line(start.x * 100, start.y * 100, end.x * 100, end.y * 100);
  }
</script>
