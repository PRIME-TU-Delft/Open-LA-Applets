<script lang="ts">
  import p5 from 'p5';
  import { onMount } from 'svelte';

  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  type Point = [number, number];

  export let start: Point;
  export let end: Point;
  export let color: string = 'black';
  export let width: number = 1;

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  onMount(() => {
    canvasContext.addDrawFn(draw, isRelative);

    return canvasContext.removeDrawFn(draw, isRelative);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(width / $scale);
    p5.line(start[0], start[1], end[0], end[1]);
  }
</script>
