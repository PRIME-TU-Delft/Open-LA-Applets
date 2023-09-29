<script lang="ts">
  import Arc2D from '$lib/d3-components/Arc.svelte';
  import Canvas2D from '$lib/d3-components/Canvas.svelte';
  import Draggable from '$lib/d3-components/Draggable.svelte';
  import Latex2D from '$lib/d3-components/Latex.svelte';
  import Vector2D from '$lib/d3-components/Vector.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const b1Default = new Vector2(2, 0);
  let b1Offset = new Vector2(0, 0);
  const b2Default = new Vector2(-1.5, 2);
  let b2Offset = new Vector2(0, 0);

  $: b1 = b1Default.clone().add(b1Offset);
  $: b2 = b2Default.clone().add(b2Offset);

  $: b1Plusb2 = b1.clone().clone().add(b2);
  $: minusB1 = b1.clone().multiplyScalar(-1);
</script>

<Canvas2D>
  <Draggable snap position={b1Default} bind:offset={b1Offset} color={PrimeColor.ultramarine} />
  <Draggable snap position={b2Default} bind:offset={b2Offset} color={PrimeColor.ultramarine} />

  <!-- Arcs -->
  <Arc2D points={[b1, b1Plusb2]} distance={0.75} color={PrimeColor.green} />
  <Arc2D points={[b2, minusB1]} distance={0.75} color={PrimeColor.green} />

  <!-- Bases -->
  <Vector2D direction={b1} length={b1.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D position={endPoint} latex={'\\vec{b_1}'} offset={new Vector2(0.2, 0.2)} />
  </Vector2D>
  <Vector2D direction={b2} length={b2.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D position={endPoint} latex={'\\vec{b_2}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>

  <!-- B1 + B2 -->
  <Vector2D direction={b1Plusb2} length={b1Plusb2.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D position={endPoint} latex={'\\vec{b_1} + \\vec{b_2}'} offset={new Vector2(0.2, 0.2)} />
  </Vector2D>

  <!-- Minus B1 -->
  <Vector2D direction={minusB1} length={b1.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D position={endPoint} latex={'-\\vec{b_1}'} offset={new Vector2(-0.2, 0.2)} />
  </Vector2D>
</Canvas2D>
