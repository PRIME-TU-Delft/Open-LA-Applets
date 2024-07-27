<script lang="ts">
  import {
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Point2D,
    Vector2D,
    RightAngle,
    Line2D,
    Canvas2D
  } from '$lib/d3-components';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import {
    leastSquaresLine,
    lineLineIntersection,
    orthogonalProjectionWithOffset
  } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2 } from 'three';
  import { distLabelLatex, projectPoints, setFormulas } from '../formula_gen';

  //TODO these vars were used to determine version of applet when contents was extracted to one file, need to remove because code had to be duplicated anyway
  //these vars are used to differentiate the four least-squares applet versions in this section
  let isOrthogonal = false; //orthogonal projection version of applet
  let isLeastSquares = true; //leastquares version of applet
  let pointsDraggable = false;

  //these vars are used to differentiate the four least-squares applet versions in this section

  let ps = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  // starting points of draggables
  let dir_L_1 = new Vector2(-1, 5);
  let dir_L_2 = new Vector2(7, 4);

  $: dir_L = dir_L_1.clone().sub(dir_L_2);
  $: [dir_L_1, dir_L_2] = pointsDraggable ? leastSquaresLine(ps) : [dir_L_1, dir_L_2];
  $: ps_proj = projectPoints(ps, isOrthogonal, isLeastSquares, dir_L_1, dir_L);
  $: formulas = setFormulas(ps_proj, isOrthogonal, isLeastSquares);
</script>

<Canvas2D {formulas} cameraPosition={new Vector2(4, 4)} cameraZoom={0.9}>
  <!-- Line L -->
  {#if !pointsDraggable}
    <Draggable2D id="dir_L_1" bind:position={dir_L_1} color={PrimeColor.cyan} snap />
    <Draggable2D id="dir_L_2" bind:position={dir_L_2} color={PrimeColor.cyan} snap />
  {/if}

  <InfiniteLine2D
    origin={dir_L_1}
    direction={dir_L_1.clone().sub(dir_L_2)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'\\mathcal{L} : y = ax + b'}
    position={dir_L_2.clone().add(new Vector2(0.2, -0.6))}
    offset={new Vector2(-0.25, 0.28)}
    color={PrimeColor.cyan}
  />

  <!-- guide lines to p1 -->
  <Line2D start={new Vector2(ps[0].x, 0)} end={ps[0]} isDashed />
  <Line2D start={new Vector2(0, ps[0].y)} end={ps[0]} isDashed />
  <Latex2D position={new Vector2(1.2, 0.3)} latex={'x_1'} />
  <Latex2D position={new Vector2(0.3, 3.3)} latex={'y_1'} />

  <Latex2D
    latex={distLabelLatex(isOrthogonal, isLeastSquares)}
    position={ps_proj[3].p
      .clone()
      .sub(ps_proj[3].pt)
      .multiplyScalar(0.5)
      .add(ps_proj[3].pt)
      .add(isOrthogonal ? new Vector2(-1.8, 0) : new Vector2(-2.65, 0))}
    color={PrimeColor.raspberry}
  />

  {#each ps_proj as pt, index}
    {#if isOrthogonal}
      <RightAngle origin={pt.pt} vs={[dir_L, pt.p.clone().sub(pt.pt)]} />
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

    <!-- {P}_n -->
    {#if pointsDraggable}
      <Draggable2D id={'p' + index} bind:position={ps[index]} color={PrimeColor.orange} snap />
    {/if}
    <Point2D position={pt.p} color={PrimeColor.orange} />
    <Latex2D
      latex={`\\mathcal{P}_${index + 1}`}
      position={pt.p}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.orange}
    />
  {/each}
</Canvas2D>
