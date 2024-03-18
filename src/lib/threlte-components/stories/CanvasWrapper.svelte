<script>
  import Canvas from '../Canvas.svelte';
</script>

<Canvas {...$$restProps}>
  <slot />
</Canvas>

<style>
  :global(.canvasWrapper) {
    --canvas-height: 30rem;
    --width: 100%;
  }

  @media all and (display-mode: fullscreen) {
    :global(.canvasWrapper) {
      --canvas-height: 100vh;
    }
  }
</style>
