<script lang="ts">
  import p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';

  import { getCanvasContext } from './CanvasContext';

  type Point = [number, number];

  export let position: Point;
  export let radius: number = 5;
  export let color: string = 'black';
  export let pulse = false;

  let canvasContext = getCanvasContext();

  onMount(() => {
    canvasContext.addDrawFn(draw);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(draw);
  });

  function draw(p5: p5) {
    p5.stroke(color);
    p5.strokeWeight(radius);

    if (pulse) {
      p5.strokeWeight(radius * 1.5 + 0.5 * radius * Math.sin(p5.millis() / 500));
    }

    p5.point(position[0], position[1]);

    // console.log('dt', p5.deltaTime);

    reset(p5);
  }

  function reset(p5: p5) {
    p5.stroke('black');
    p5.strokeWeight(1);
  }
</script>
