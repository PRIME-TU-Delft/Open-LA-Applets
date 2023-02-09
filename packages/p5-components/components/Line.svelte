<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';

  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  type Point = [number, number];

  export let start: Point;
  export let end: Point;
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
    p5.line(start[0] * 100, start[1] * 100, end[0] * 100, end[1] * 100);
  }
</script>
