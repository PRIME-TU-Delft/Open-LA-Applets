<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
</script>

<!-- We give the Canvas2D component a title prop -->
<Canvas2D title={{ en: 'Complex numbers addition', nl: 'Optellen van complexe getallen' }}>
  <Vector2D />
</Canvas2D>
