<script>
  import Canvas from '../Canvas.svelte';
</script>

<Canvas --height="30rem" --width="100%" {...$$restProps}>
  <slot />
</Canvas>
