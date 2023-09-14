<script lang="ts">
  import type p5 from 'p5';
  import { onDestroy, onMount } from 'svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { GridType, Grid } from './Grids';

  import { getCanvasContext } from './CanvasContext';

  export let gridType: GridType = GridType.simpleGrid;

  let canvasContext = getCanvasContext();
  const { scale } = canvasContext;

  const key = Symbol('axis');

  onMount(() => {
    canvasContext.addDrawFn(draw, key, true);
  });

  onDestroy(() => {
    canvasContext.removeDrawFn(key);
  });

  function draw(p5: p5) {
    p5.stroke(PrimeColor.black);
    p5.strokeWeight(2);

    const w = p5.width;
    const h = p5.height;
    const size = Math.max(w, h);

    Grid.drawGrid(p5, size, gridType, $scale);
  }
</script>
