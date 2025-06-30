<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { leastSquaresLine, round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { projectPoints } from '../formula_gen';

  let draggables = [
    new Draggable(new Vector2(1, 3), PrimeColor.orange, '\\mathcal{P}_1', Draggable.snapToGrid),
    new Draggable(new Vector2(2, 1), PrimeColor.orange, '\\mathcal{P}_2', Draggable.snapToGrid),
    new Draggable(new Vector2(3, 3), PrimeColor.orange, '\\mathcal{P}_3', Draggable.snapToGrid),
    new Draggable(new Vector2(4, 7), PrimeColor.orange, '\\mathcal{P}_4', Draggable.snapToGrid),
    new Draggable(new Vector2(5, 3), PrimeColor.orange, '\\mathcal{P}_5', Draggable.snapToGrid)
  ];

  const points = $derived(draggables.map((d) => d.value));

  let [dir_L_1, dir_L_2] = $derived(leastSquaresLine(draggables.map((d) => d.value)));

  const dir_L = $derived(dir_L_1.clone().sub(dir_L_2));
  const ps_proj = $derived(projectPoints(points, false, true, dir_L_1, dir_L));

  const formulas = $derived.by(() => {
    const sum_square_dist = ps_proj.reduce((acc, pt) => acc + Math.pow(pt.dist, 2), 0);

    const f1 = new Formula('\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|^2  = \\$1 ').addAutoParam(
      round(sum_square_dist),
      PrimeColor.raspberry
    );
    return [f1];
  });
</script>

<Canvas2D {formulas} {draggables} cameraPosition={new Vector2(4, 4)} cameraZoom={0.9}>
  <!-- L -->
  <InfiniteLine2D
    origin={dir_L_1}
    direction={dir_L_1.clone().sub(dir_L_2)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\mathcal{L} : y = ax + b'}
    position={dir_L_2}
    offset={new Vector2(0.5, 0.28)}
    color={PrimeColor.cyan}
  />

  <!-- guide lines to p1 -->
  {@const p1 = draggables[0].position}
  <Line2D start={new Vector2(p1.x, 0)} end={p1} isDashed />
  <Line2D start={new Vector2(0, p1.y)} end={p1} isDashed />
  <Latex2D position={new Vector2(p1.x, p1.clone().multiplyScalar(0.5).y)} latex={'x_1'} />
  <Latex2D position={new Vector2(p1.clone().multiplyScalar(0.5).x, p1.y)} latex={'y_1'} />

  {#each ps_proj as pt}
    <!-- distances -->
    <Vector2D
      origin={pt.p}
      direction={pt.pt.clone().sub(pt.p)}
      length={pt.p.clone().sub(pt.pt).length()}
      color={PrimeColor.raspberry}
      hideHead
    />
    <Latex2D
      position={pt.p.clone().sub(pt.pt).multiplyScalar(0.5).add(pt.pt).add(new Vector2(0.1, 0))}
      latex={pt.dist.toFixed(2)}
      offset={new Vector2(0, 0.2)}
    />
  {/each}
</Canvas2D>
