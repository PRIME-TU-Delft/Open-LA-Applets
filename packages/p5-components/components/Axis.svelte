<script lang="ts">
  import p5 from 'p5';
  import { onMount } from 'svelte';
  import { PrimeColor } from 'utils/PrimeColors';
  import { GridType, Grid } from './Grids';

  import { getCanvasContext } from './CanvasContext';

  export let gridType = GridType.simpleGrid;

  let canvasContext = getCanvasContext();

  onMount(() => {
    canvasContext.addDrawFn(draw, true);

    return canvasContext.removeDrawFn(draw, true);
  });

  function draw(p5: p5) {
    p5.stroke(PrimeColor.black);
    p5.strokeWeight(2);

    const w = p5.width;
    const h = p5.height;
    const size = Math.max(w, h);

    switch (gridType) {
      case GridType.squareGrid:
        Grid.drawSquareGrid(p5, size);
        break;
      case GridType.none:
        break;
      default:
        Grid.drawSimpleGrid(p5, size);
    }
  }
</script>
