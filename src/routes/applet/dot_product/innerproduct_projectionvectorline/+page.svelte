<script lang="ts">
  import { Canvas2D, Line2D, Vector2D, Latex2D } from '$lib/p5-components';

  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Draggables from '$lib/p5-components/components/Draggables.svelte';

  let v = new Vector2(1, 0.5);
  let v_default = new Vector2(1, 0.4);
  $: v_length = v.length();

  $: L_start = v.clone().multiplyScalar(-20);
  $: L_end = v.clone().multiplyScalar(20);
  $: L_label = v.clone().normalize().multiplyScalar(3.3).addScalar(0.3);

  let w = new Vector2(2.5, 2.5);
  let w_default = new Vector2(2.5, 2.5);
  $: w_length = w.length();

  $: proj_w = v.clone().multiplyScalar(w.clone().dot(v) / v.clone().dot(v));
  $: proj_w_length = proj_w.length();
</script>

<Canvas2D>
  <!-- origin label-->
  <Latex2D latex={'O'} offset={new Vector2(-0.15, -0.16)} />

  <!-- L /-->
  <Line2D start={L_start} end={L_end} color={PrimeColor.purple} />
  <Latex2D latex={'\\mathcal{L}'} offset={L_label} color={PrimeColor.purple} />

  <!-- projection guide/-->
  <Line2D start={w} end={proj_w} isDashed />

  <!-- projection w -->
  <Vector2D direction={proj_w} length={proj_w_length} color={PrimeColor.red}>
    <Latex2D latex={'\\^{w}'} offset={new Vector2(0, -0.2)} color={PrimeColor.red} />
  </Vector2D>

  <!-- v -->
  <Draggables bind:position={v} defaultPosition={v_default} color={PrimeColor.ultramarine} />
  <Vector2D direction={v} length={v_length} color={PrimeColor.ultramarine}>
    <Latex2D latex={'v'} offset={new Vector2(0, -0.2)} color={PrimeColor.ultramarine} />
  </Vector2D>

  <!-- w -->
  <Draggables bind:position={w} defaultPosition={w_default} color={PrimeColor.green} />
  <Vector2D direction={w} length={w_length} color={PrimeColor.green}>
    <Latex2D latex={'w'} offset={new Vector2(-0.2, 0.1)} color={PrimeColor.green} />
  </Vector2D>
</Canvas2D>
