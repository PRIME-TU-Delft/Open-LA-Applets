<script lang="ts">
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import VectorField2D from '$lib/d3/VectorField2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const rotation = (x: number, y: number) => new Vector2(-y, x);
</script>

<Canvas2D>
  <VectorField2D f={rotation} step={0.5} color={PrimeColor.blue} />
</Canvas2D>
