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

  //TODO these vars were used to determine version of applet when contents was extracted to one file, need to remove because code had to be duplicated anyway

  export let isOrthogonal = false; //orthogonal projection version of applet
  export let isLeastSquares = true; //leastquares version of applet
  export let pointsDraggable = false;

  const distLabelLatex = isOrthogonal
    ? '\\mathrm{dist}(\\mathcal{P}_4, \\mathcal{L}) \\rightarrow'
    : isLeastSquares
      ? '|y_4 - (ax_4 + b_4)|^2\\rightarrow'
      : '|y_4 - (ax_4 + b_4)| \\rightarrow';

  let ps = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 3)
  ];

  const m = new Matrix3();
  m.set(0, 1, 0, 1, 0, 0, 0, 0, 1);

  let dir_L_1 = new Vector2(-1, 5);
  let dir_L_2 = new Vector2(7, 4);

  $: [dir_L_1, dir_L_2] = pointsDraggable ? leastSquaresLine(ps) : [dir_L_1, dir_L_2];

  $: dir_L = dir_L_1.clone().sub(dir_L_2);

  //non orth proj funct
  function projectInY(p: Vector2, origin_L: Vector2, dir_L: Vector2) {
    return lineLineIntersection(
      new Vector2(p.x, 100),
      new Vector2(p.x, -100),
      dir_L.clone().multiplyScalar(20).add(origin_L),
      dir_L.clone().multiplyScalar(-20).add(origin_L)
    );
  }

  $: ps_proj = ps.map((p) => {
    let pt: Vector2;
    if (isOrthogonal) {
      pt = orthogonalProjectionWithOffset(p, dir_L_1, dir_L);
    } else {
      pt = projectInY(p, dir_L_1, dir_L);
    }

    let dist = p.clone().sub(pt).length();
    isLeastSquares ? (dist = dist * dist) : (dist = dist);
    return { p, pt, dist };
  });

  function calcTotalDist(u_ts: any[]) {
    return u_ts
      .map((p) => p.dist)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  const formulaLatex = isOrthogonal
    ? '\\sum_{n=1}^{5} dist(\\$1,\\$2) = \\$3'
    : isLeastSquares
      ? '\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|^2  = \\$3 '
      : '\\sum_{n=1}^{5} |y_n - (ax_n + b_n)|^2  = \\$3 ';

  export function setFormulas(u_ts: any[]) {
    const f2 = new Formula(formulaLatex)
      .addParam(1, '\\mathcal{P}_n', PrimeColor.orange)
      .addParam(2, '\\mathcal{L}', PrimeColor.cyan)
      .addParam(3, calcTotalDist(u_ts).toFixed(2), PrimeColor.raspberry);
    const formulas = new Formulas(f2).align();

    return formulas;
  }

  $: formulas = setFormulas(ps_proj);
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
    latex={distLabelLatex}
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
