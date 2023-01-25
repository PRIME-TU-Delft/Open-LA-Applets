<script lang="ts">
  import p5 from 'p5';
  import { getContext, onDestroy, onMount } from 'svelte';

  type Point = [number, number];

  export let start: Point;
  export let end: Point;

  // TODO: improve type safety: https://www.reddit.com/r/sveltejs/comments/szc481/sveltes_context_and_type_safety_with_typescript/
  let canvasContext = getContext<any>('canvas');

  onMount(() => {
    console.log('onMount', 'line');
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
