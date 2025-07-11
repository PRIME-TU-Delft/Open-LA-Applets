<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import InfiniteLine2D from '$lib/d3/InfiniteLine2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { projectPoints, type UT } from '../formula_gen';

  const cameraPosition = new Vector2(4, 4);
  const cameraZoom = 1.39;

  const points = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  // LEFT SCENE
  let draggables_left = [
    new Draggable(new Vector2(-1, 5), PrimeColor.cyan, '', Draggable.snapToGrid),
    new Draggable(new Vector2(7, 4), PrimeColor.cyan, '', Draggable.snapToGrid)
  ];

  const dir_L_left = $derived(draggables_left[0].value.clone().sub(draggables_left[1].value));
  const ps_proj_left = $derived(
    projectPoints(points, true, false, draggables_left[0].value, dir_L_left)
  );

  const formulas_left = $derived.by(() => {
    const totalDist = ps_proj_left.reduce((acc, pt) => acc + pt.dist, 0);

    const f1 = new Formula('\\sum_{n=1}^{5} \\mathrm{dist}(\\$1,\\$2) = \\$3')
      .addParam(1, '\\mathcal{P}_n', PrimeColor.orange)
      .addParam(2, '\\mathcal{L}', PrimeColor.cyan)
      .addParam(3, totalDist > 1e5 ? '\\infin' : round(totalDist), PrimeColor.raspberry);

    return [f1];
  });

  // RIGHT SCENE
  let draggables_right = [
    new Draggable(new Vector2(-1, 5), PrimeColor.cyan),
    new Draggable(new Vector2(7, 4), PrimeColor.cyan)
  ];

  $effect.pre(() => {
    // Fallback to check if the points are on the same vertical line
    // This is where the distances are infinite and will result in a NaN error
    // Thus we need to move the first point slightly to the right
    if (draggables_right[0].position.x == draggables_right[1].position.x) {
      draggables_right[0].value = new Vector2(
        draggables_right[0].value.x + 1,
        draggables_right[0].value.y
      );
    }
  });

  const dir_L_right = $derived(draggables_right[0].value.clone().sub(draggables_right[1].value));
  const ps_proj_right = $derived(
    projectPoints(points, false, false, draggables_right[0].value, dir_L_right)
  );

  const formulas_right = $derived.by(() => {
    const sum_dist = ps_proj_right.reduce((acc, pt) => acc + pt.dist, 0);

    const f1 = new Formula('\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|  = \\$1 ').addAutoParam(
      round(sum_dist),
      PrimeColor.raspberry
    );
    return [f1];
  });
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  draggables={draggables_left}
  formulas={formulas_left}
  splitFormulas={formulas_right}
  splitCanvas2DProps={{
    cameraPosition: cameraPosition,
    cameraZoom: cameraZoom,
    draggables: draggables_right
  }}
>
  {@render LeastSquaresScene(draggables_left, ps_proj_left, true)}

  {#snippet splitCanvas2DChildren()}
    {@render LeastSquaresScene(draggables_right, ps_proj_right, false)}
  {/snippet}
</Canvas2D>

{#snippet LeastSquaresScene(draggables: Draggable[], ps_proj: UT[], showRightAngles: boolean)}
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
    {#if showRightAngles}
      <RightAngle2D origin={pt.pt} vs={[dir_L_left, pt.p.clone().sub(pt.pt)]} />
    {/if}

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
{/snippet}
