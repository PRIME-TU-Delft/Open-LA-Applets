<script lang="ts">
  import { setContext } from 'svelte';
  import { getCanvasContext, setRelativeContext } from './CanvasContext';

  let canvasContext = getCanvasContext();

  let { mouseX, mouseY, height, width, scale } = canvasContext;
  setRelativeContext(true);
</script>

<slot
  mouseX={(-0.5 * ($mouseY - $height / 2)) / $scale}
  mouseY={(0.5 * ($mouseX - $width / 2)) / $scale}
/>
