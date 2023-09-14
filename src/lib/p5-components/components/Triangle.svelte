<script lang="ts">
  import type p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { Vector2 } from 'three';
  import { getCanvasContext, getRelativeContext } from './CanvasContext';

  export let points: [Vector2, Vector2, Vector2] = [new Vector2(), new Vector2(), new Vector2()];
  export let color: string = 'black';

  let canvasContext = getCanvasContext();
  let isRelative = getRelativeContext();

  const key = Symbol('triangle');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, isRelative);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.fill(color);
    p5.strokeWeight(0);

    // Multiply by 100 to scale up to canvas size
    const pts = points.map((p) => p.clone().multiplyScalar(100));

    p5.triangle(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y);
  }
</script>
