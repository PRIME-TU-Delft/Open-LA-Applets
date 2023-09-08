<script lang="ts">
  import AbstractCanvas from '$lib/components/AbstractCanvas.svelte';
  import P5Canvas from './P5Canvas.svelte';
</script>

<AbstractCanvas let:width let:height>
  <P5Canvas size={{ width, height }}>
    <slot />
  </P5Canvas>
</AbstractCanvas>
