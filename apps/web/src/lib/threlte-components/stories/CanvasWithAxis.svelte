<script>
  import Axis from '../Axis.svelte';

  import CanvasWrapper from './CanvasWrapper.svelte';
</script>

<CanvasWrapper>
  <slot />
  <Axis />
</CanvasWrapper>
