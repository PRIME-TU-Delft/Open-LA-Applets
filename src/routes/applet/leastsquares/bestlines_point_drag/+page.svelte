<script lang="ts">
  import {
    Canvas2D,
    Draggable2D,
    InfiniteLine2D,
    Latex2D,
    Point2D,
    Vector2D,
    RightAngle,
    Line2D
  } from '$lib/d3-components';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { lineLineIntersection, orthogonalProjectionWithOffset } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Matrix3, Vector2 } from 'three';

  export let isOrthogonal = false;

  let ps = [
    new Vector2(1, 3),
    new Vector2(2, 1),
    new Vector2(3, 3),
    new Vector2(4, 7),
    new Vector2(5, 5)
  ];

  function leastSquaresLine(points: Vector2[]) {
    const n = points.length;

    // Calculate the means of x and y
    let meanX = 0;
    let meanY = 0;
    for (const point of points) {
      meanX += point.x;
      meanY += point.y;
    }
    meanX /= n;
    meanY /= n;

    // Calculate the slope (m)
    let numerator = 0;
    let denominator = 0;
    for (const point of points) {
      numerator += (point.x - meanX) * (point.y - meanY);
      denominator += (point.x - meanX) ** 2;
    }
    const slope = numerator / denominator;

    // Calculate the y-intercept (b)
    const intercept = meanY - slope * meanX;

    // Determine two points on the line
    // Using the min and max x-values to determine the points
    const x1 = Math.min(...points.map((p) => p.x));
    const x2 = Math.max(...points.map((p) => p.x));
    const y1 = slope * x1 + intercept;
    const y2 = slope * x2 + intercept;

    return [new Vector2(x1, y1), new Vector2(x2, y2)];
  }
  let dir_L_1 = new Vector2(-1, 5);
  let dir_L_2 = new Vector2(7, 4);

  $: [dir_L_1, dir_L_2] = leastSquaresLine(ps);

  const m = new Matrix3();
  m.set(0, 1, 0, 1, 0, 0, 0, 0, 1);

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

  $: u_ts = ps.map((p) => {
    let pt: Vector2;
    if (isOrthogonal) {
      pt = orthogonalProjectionWithOffset(p, dir_L_1, dir_L);
    } else {
      pt = projectInY(p, dir_L_1, dir_L);
    }

    const dist = p.clone().sub(pt).length();
    return { p, pt, dist };
  });

  function calcTotalDist(u_ts: any[]) {
    return u_ts
      .map((p) => p.dist)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  function setFormulas(u_ts: any[]) {
    const f2 = new Formula('\\sum_{n=1}^{5} dist(\\$1,\\$2) = \\$3')
      .addParam(1, '\\mathrm{P}_n', PrimeColor.orange)
      .addParam(2, 'l', PrimeColor.cyan)
      .addParam(3, calcTotalDist(u_ts).toFixed(2), PrimeColor.raspberry);
    const formulas = new Formulas(f2).align();

    return formulas;
  }

  $: formulas = setFormulas(u_ts);
</script>

<Canvas2D {formulas} cameraPosition={new Vector2(4, 4)} cameraZoom={0.9}>
  <!-- Line L -->

  <InfiniteLine2D
    origin={dir_L_1}
    direction={dir_L_1.clone().sub(dir_L_2)}
    color={PrimeColor.cyan}
  />
  <Latex2D
    latex={'l : y = ax + b'}
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
    latex={isOrthogonal
      ? 'dist(\\mathrm{P}_4, l) \\rightarrow'
      : '|y_2 - (ax_2 + b_2)| \\rightarrow'}
    position={u_ts[3].p
      .clone()
      .sub(u_ts[3].pt)
      .multiplyScalar(0.5)
      .add(u_ts[3].pt)
      .add(isOrthogonal ? new Vector2(-1.7, 0) : new Vector2(-2.5, 0))}
    color={PrimeColor.raspberry}
  />

  {#each u_ts as pt, index}
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

    <!-- p_n -->
    <Draggable2D id={'p' + index} bind:position={ps[index]} color={PrimeColor.orange} snap />
    <Point2D position={pt.p} color={PrimeColor.orange} />
    <Latex2D
      latex={`P_${index + 1}`}
      position={pt.p}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.orange}
    />
  {/each}
</Canvas2D>
