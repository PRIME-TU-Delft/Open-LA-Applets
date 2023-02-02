<script lang="ts">
  import { getCanvasContext, setRelativeContext } from './CanvasContext';

  let canvasContext = getCanvasContext();

  let { mouseX, mouseY, height, width, scale } = canvasContext;
  setRelativeContext(true);
</script>

<slot mouseX={($mouseX - $width / 2) / $scale} mouseY={(-1 * ($mouseY - $height / 2)) / $scale} />
