<script lang="ts">
  import { setContext } from 'svelte';
  import { getCanvasContext, setRelativeContext } from './CanvasContext';

  let canvasContext = getCanvasContext();

  let { mouseX, mouseY } = canvasContext;

  setRelativeContext(false);
</script>

<slot {mouseX} {mouseY} />
