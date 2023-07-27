<script>
  import Canvas from '../Canvas.svelte';
</script>

<Canvas {...$$restProps}>
  <slot />
</Canvas>

<style>
  :global(.canvasWrapper) {
    --height: 30rem;
    --width: 100%;
  }

  @media all and (display-mode: fullscreen) {
    :global(.canvasWrapper) {
      --height: 100vh;
    }
  }
</style>
