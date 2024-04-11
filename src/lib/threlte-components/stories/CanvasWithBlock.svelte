<script>
  import Canvas from '../Canvas.svelte';
  import { T } from '@threlte/core';
</script>

<Canvas {...$$restProps}>
  <slot />
  <slot name="lights" />
  <slot name="formulas" />
  <T.Mesh>
    <T.BoxGeometry />
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
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
