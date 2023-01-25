<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';

  import { getCanvasContext } from './CanvasContext';

  type Point = [number, number];

  export let start: Point;
  export let end: Point;

  let canvasContext = getCanvasContext();

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });

  function draw(p5: p5) {
    // p5.stroke(0);
    // p5.strokeWeight(2);
    p5.line(start[0], start[1], end[0], end[1]);
  }
</script>
