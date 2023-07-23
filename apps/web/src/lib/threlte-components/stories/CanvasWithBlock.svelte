<script>
  import Canvas from '../Canvas.svelte';
  import { T } from '@threlte/core';
</script>

<Canvas --height="30rem" --width="100%" {...$$restProps}>
  <slot />
  <slot name="lights" />
  <slot name="formulas" />
  <T.Mesh>
    <T.BoxGeometry />
    <T.MeshBasicMaterial color={'red'} />
  </T.Mesh>
</Canvas>
