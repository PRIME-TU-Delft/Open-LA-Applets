<script lang="ts">
  import {
    Canvas2D,
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Line2D,
    Point2D,
    RightAngle,
    Vector2D
  } from '$lib/d3-components';
  import { Vector2 } from 'three';
  import { distLabelLatex, projectPoints, setFormulas } from '../formula_gen';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const cameraPosition = new Vector2(4, 4);
  const cameraZoom = 1.39;

  //these vars are used to differentiate the four least-squares applet versions in this section
  let isOrthogonal_left = true; //orthogonal projection version of applet
  let isLeastSquares_left = false; //leastquares version of applet

  let ps_left = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  // starting points of draggables
  let dir_L_1_left = new Vector2(-1, 5);
  let dir_L_2_left = new Vector2(7, 4);

  $: dir_L_left = dir_L_1_left.clone().sub(dir_L_2_left);
  $: ps_proj_left = projectPoints(
    ps_left,
    isOrthogonal_left,
    isLeastSquares_left,
    dir_L_1_left,
    dir_L_left
  );
  $: formulas_left = setFormulas(ps_proj_left, isOrthogonal_left, isLeastSquares_left);

  //same for right side
  //these vars are used to differentiate the four least-squares applet versions in this section
  let isOrthogonal_right = false; //orthogonal projection version of applet
  let isLeastSquares_right = false; //leastquares version of applet

  let ps_right = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  // starting points of draggables
  let dir_L_1_right = new Vector2(-1, 5);
  let dir_L_2_right = new Vector2(7, 4);

  $: dir_L_right = dir_L_1_right.clone().sub(dir_L_2_right);
  $: ps_proj_right = projectPoints(
    ps_right,
    isOrthogonal_right,
    isLeastSquares_right,
    dir_L_1_right,
    dir_L_right
  );
  $: formulas_right = setFormulas(ps_proj_right, isOrthogonal_right, isLeastSquares_right);
</script>

<Canvas2D
  {cameraPosition}
  {cameraZoom}
  formulas={formulas_left}
  splitCanvas2DProps={{ cameraPosition: cameraPosition, cameraZoom: cameraZoom }}
  splitFormulas={formulas_right}
>
  <!--                                                                                        LEFT VERSION -->
  <!-- Line L -->

  <Draggable2D id="dir_L_1_left" bind:position={dir_L_1_left} color={PrimeColor.cyan} snap />
  <Draggable2D id="dir_L_2_left" bind:position={dir_L_2_left} color={PrimeColor.cyan} snap />

  <InfiniteLine2D
    origin={dir_L_1_left}
    direction={dir_L_1_left.clone().sub(dir_L_2_left)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\mathcal{L} : y = ax + b'}
    position={dir_L_2_left.clone().add(new Vector2(0.2, -0.6))}
    offset={new Vector2(-0.25, 0.28)}
    color={PrimeColor.cyan}
  />

  <!-- guide lines to p1 -->
  <Line2D start={new Vector2(ps_left[0].x, 0)} end={ps_left[0]} isDashed />
  <Line2D start={new Vector2(0, ps_left[0].y)} end={ps_left[0]} isDashed />
  <Latex2D position={new Vector2(1.2, 0.3)} latex={'x_1'} />
  <Latex2D position={new Vector2(0.3, 3.3)} latex={'y_1'} />

  <Latex2D
    latex={distLabelLatex(isOrthogonal_left, isLeastSquares_left)}
    position={ps_proj_left[3].p
      .clone()
      .sub(ps_proj_left[3].pt)
      .multiplyScalar(0.5)
      .add(ps_proj_left[3].pt)
      .add(isOrthogonal_left ? new Vector2(-1.8, 0) : new Vector2(-2.65, 0))}
    color={PrimeColor.raspberry}
  />

  {#each ps_proj_left as pt, index}
    {#if isOrthogonal_left}
      <RightAngle origin={pt.pt} vs={[dir_L_left, pt.p.clone().sub(pt.pt)]} />
    {/if}
    <!-- distances -->
    <Vector2D
      origin={pt.p}
      direction={pt.pt.clone().sub(pt.p)}
      length={pt.p.clone().sub(pt.pt).length()}
      color={PrimeColor.raspberry}
      hideHead
    />
    {#key pt}
      <Latex2D
        position={pt.p.clone().sub(pt.pt).multiplyScalar(0.5).add(pt.pt).add(new Vector2(0.1, 0))}
        latex={pt.dist.toFixed(2)}
      />
    {/key}

    <!-- \\mathcal{P}_n -->
    <Point2D position={pt.p} color={PrimeColor.orange} />
    <Latex2D
      latex={`\\mathcal{P}_${index + 1}`}
      position={pt.p}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.orange}
    />
  {/each}
  <svelte:fragment slot="splitCanvas">
    <!--                                                                                RIGHT VERSION -->

    <!-- Line L -->

    <Draggable2D id="dir_L_1_right" bind:position={dir_L_1_right} color={PrimeColor.cyan} snap />
    <Draggable2D id="dir_L_2_right" bind:position={dir_L_2_right} color={PrimeColor.cyan} snap />

    <InfiniteLine2D
      origin={dir_L_1_right}
      direction={dir_L_1_right.clone().sub(dir_L_2_right)}
      color={PrimeColor.cyan}
    />
    <Latex2D
      latex={'\\mathcal{L} : y = ax + b'}
      position={dir_L_2_right.clone().add(new Vector2(0.2, -0.6))}
      offset={new Vector2(-0.25, 0.28)}
      color={PrimeColor.cyan}
    />

    <!-- guide lines to p1 -->
    <Line2D start={new Vector2(ps_right[0].x, 0)} end={ps_right[0]} isDashed />
    <Line2D start={new Vector2(0, ps_right[0].y)} end={ps_right[0]} isDashed />
    <Latex2D position={new Vector2(1.2, 0.3)} latex={'x_1'} />
    <Latex2D position={new Vector2(0.3, 3.3)} latex={'y_1'} />

    <Latex2D
      latex={distLabelLatex(isOrthogonal_right, isLeastSquares_right)}
      position={ps_proj_right[3].p
        .clone()
        .sub(ps_proj_right[3].pt)
        .multiplyScalar(0.5)
        .add(ps_proj_right[3].pt)
        .add(isOrthogonal_right ? new Vector2(-1.8, 0) : new Vector2(-2.65, 0))}
      color={PrimeColor.raspberry}
    />

    {#each ps_proj_right as pt, index}
      {#if isOrthogonal_right}
        <RightAngle origin={pt.pt} vs={[dir_L_right, pt.p.clone().sub(pt.pt)]} />
      {/if}
      <!-- distances -->
      <Vector2D
        origin={pt.p}
        direction={pt.pt.clone().sub(pt.p)}
        length={pt.p.clone().sub(pt.pt).length()}
        color={PrimeColor.raspberry}
        hideHead
      />
      {#key pt}
        <Latex2D
          position={pt.p.clone().sub(pt.pt).multiplyScalar(0.5).add(pt.pt).add(new Vector2(0.1, 0))}
          latex={pt.dist.toFixed(2)}
        />
      {/key}

      <!-- \\mathcal{P}_n -->
      <Point2D position={pt.p} color={PrimeColor.orange} />
      <Latex2D
        latex={`\\mathcal{P}_${index + 1}`}
        position={pt.p}
        offset={new Vector2(0.2, 0.2)}
        color={PrimeColor.orange}
      />
    {/each}
  </svelte:fragment>
</Canvas2D>
