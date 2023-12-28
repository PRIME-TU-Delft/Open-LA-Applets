<script lang="ts">
  import { Canvas2D, Line2D, Vector2D, Latex2D, Draggable2D, RightAngle } from '$lib/d3-components';

  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  let v = new Vector2(1, 0.5);

  $: L_start = v.clone().multiplyScalar(-20);
  $: L_end = v.clone().multiplyScalar(20);
  $: L_label = v.clone().normalize().multiplyScalar(5).add(new Vector2(-0.3, 0.3));

  let w = new Vector2(2.5, 2.5);

  $: proj_w = v.clone().multiplyScalar(w.clone().dot(v) / v.clone().dot(v));

  // nesc for drawing right angle
  $: proj_w_min_w = w.clone().sub(proj_w);
</script>

<Canvas2D>
  <!-- L /-->
  <Line2D start={L_start} end={L_end} color={PrimeColor.purple} />
  <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.purple} />

  <!-- projection guide/-->
  <Line2D start={w} end={proj_w} isDashed />

  <!-- projection of w -->
  <Vector2D direction={proj_w} length={proj_w.length()} color={PrimeColor.red} />
  <Latex2D
    latex={'\\mathbf{\\hat{w}}'}
    offset={proj_w.clone().add(new Vector2(0, -0.2))}
    color={PrimeColor.red}
  />

  <!-- v -->
  <Draggable2D id="v" bind:position={v} color={PrimeColor.blue} />
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{v}'}
    offset={v.clone().add(new Vector2(0, -0.2))}
    color={PrimeColor.blue}
  />

  <!-- w -->
  <Draggable2D id="w" bind:position={w} color={PrimeColor.darkGreen} />
  <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen} />
  <Latex2D latex={'\\mathbf{w}'} offset={w.clone().add(new Vector2(0.1, 0.2))} color={PrimeColor.darkGreen} />

  <!-- right angle -->
  <RightAngle size={0.3} vs={[proj_w_min_w, v.clone().multiplyScalar(-1)]} origin={proj_w} />
</Canvas2D>
