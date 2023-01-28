<script lang="ts">
  import p5 from 'p5';
  import { onMount } from 'svelte';

  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  type Point = [number, number];

  export let position: Point;
  export let radius: number = 5;
  export let color: string = 'black';
  export let pulse = false;

  const canvasContext = getCanvasContext();
  const isRelative = getRelativeContext();
  let scale = canvasContext.scale;

  onMount(() => {
    canvasContext.addDrawFn(draw, isRelative);

    return canvasContext.removeDrawFn(draw, isRelative);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(radius / $scale);

    if (pulse) {
      p5.strokeWeight((radius * 1.5 + 0.5 * radius * Math.sin(p5.millis() / 500)) / $scale);
    }

    p5.point(position[0], position[1]);
  }
</script>
