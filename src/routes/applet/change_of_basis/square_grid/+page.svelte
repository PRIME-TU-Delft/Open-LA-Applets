<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D } from '$lib/p5-components';
  import Draggable2D from '$lib/p5-components/components/Draggables.svelte';
  import { GridType } from '$lib/p5-components/components/Grids';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let b1 = new Vector2(2, 0);
  const b1Default = new Vector2(2, 0);
  let b2 = new Vector2(-1.5, 2);
  const b2Default = new Vector2(-1.5, 2);

  $: b1Plusb2 = b1.clone().add(b2);
  $: minusB1 = b1.clone().multiplyScalar(-1);
</script>

<Canvas2D gridType={GridType.squareGrid}>
  <Draggable2D snap bind:position={b1} defaultPosition={b1Default} color={PrimeColor.ultramarine} />
  <Draggable2D snap bind:position={b2} defaultPosition={b2Default} color={PrimeColor.ultramarine} />

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
