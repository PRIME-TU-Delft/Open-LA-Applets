<script lang="ts">
  import p5 from 'p5';
  import { onMount } from 'svelte';
  import { PrimeColor } from 'utils/PrimeColors';

  import { getCanvasContext } from './CanvasContext';

  let canvasContext = getCanvasContext();

  onMount(() => {
    canvasContext.addDrawFn(draw, false);

    return canvasContext.removeDrawFn(draw, false);
  });

  function draw(p5: p5) {
    p5.stroke(PrimeColor.black);
    p5.strokeWeight(2);

    const w = p5.width;
    const h = p5.height;

    p5.line(w / 2, 0, w / 2, h);
    p5.line(0, h / 2, w, h / 2);
  }
</script>
