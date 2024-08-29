<script>
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { Vector2 } from 'three';
  import TransformedAxis from './TransformedAxis.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';

  const b1 = new Vector2(1, 3);
  const b2 = new Vector2(2, 1);

  const draggables = [new Draggable(new Vector2(6, -2))];
</script>

<Canvas2D customAxis {draggables}>
  <TransformedAxis basis={[b1, b2]} />

  <!-- Basis -->
  <Vector2D direction={b1} length={b1.length()} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{b_1}'} position={b1} extend={0.2} color={PrimeColor.raspberry} />

  <Vector2D direction={b2} length={b2.length()} color={PrimeColor.raspberry} />
  <Latex2D latex={'\\mathbf{b_2}'} position={b2} extend={0.2} color={PrimeColor.raspberry} />

  <!-- Compound -->
  <Vector2D direction={b1} length={-2} />
</Canvas2D>
