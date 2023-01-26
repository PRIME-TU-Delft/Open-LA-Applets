<script lang="ts">
  import { setContext } from 'svelte';
  import { getCanvasContext } from './CanvasContext';

  let canvasContext = getCanvasContext();

  let { mouseX, mouseY, height, width, scale } = canvasContext;

  console.log($mouseX, $mouseY, $height, $width, $scale);

  setContext('relative', true);
</script>

<slot
  mouseX={(-0.5 * ($mouseY - 1000 / 2)) / $scale}
  mouseY={(0.5 * ($mouseX - $width / 2)) / $scale}
/>
