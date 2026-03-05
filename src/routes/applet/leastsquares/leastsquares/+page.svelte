<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { projectPoints } from '../formula_gen';

  let points = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  let draggables = [
    new Draggable(new Vector2(-1, 5), PrimeColor.cyan),
    new Draggable(new Vector2(7, 4), PrimeColor.cyan)
  ];

  $effect.pre(() => {
    // Fallback to check if the points are on the same vertical line
    // This is where the distances are infinite and will result in a NaN error
    // Thus we need to move the first point slightly to the right
    if (draggables[0].position.x == draggables[1].position.x) {
      draggables[0].value = new Vector2(draggables[0].value.x + 0.001, draggables[0].value.y);
    }
  });

  const dir_L = $derived(draggables[0].position.clone().sub(draggables[1].position));
  const ps_proj = $derived(projectPoints(points, false, true, draggables[0].position, dir_L));

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
    origin={draggables[0].position}
    direction={draggables[0].position.clone().sub(draggables[1].position)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\mathcal{L} : y = ax + b'}
    position={draggables[1].position}
    offset={new Vector2(0, -0.28)}
    color={PrimeColor.cyan}
  />

  <!-- guide lines to p1 -->
  {@const p1 = points[0]}
  <Line2D start={new Vector2(p1.x, 0)} end={p1} isDashed />
  <Line2D start={new Vector2(0, p1.y)} end={p1} isDashed />
  <Latex2D position={new Vector2(p1.x, p1.clone().multiplyScalar(0.5).y)} latex="x_1" />
  <Latex2D position={new Vector2(p1.clone().multiplyScalar(0.5).x, p1.y)} latex="y_1" />

  {#each ps_proj as pt, index (index)}
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

    <!-- \\mathcal{P}_n -->
    <Point2D position={pt.p} color={PrimeColor.orange} />
    <Latex2D
      latex={`\\mathcal{P}_${index + 1}`}
      position={pt.p}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.orange}
    />
  {/each}
</Canvas2D>
