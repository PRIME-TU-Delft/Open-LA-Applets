<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import {
    Canvas2D,
    Draggable2D,
    Latex2D,
    Line2D,
    Point2D,
    RightAngle,
    Vector2D
  } from '$lib/d3-components';
  import { GridType } from '$lib/d3-components/grids/GridTypes';

  const dir_L = new Vector2(2, 1);
  const start_L = dir_L.clone().multiplyScalar(-30);
  const end_L = dir_L.clone().multiplyScalar(30);

  let u1 = new Vector2(2, 3);

  let w1 = dir_L
    .clone()
    .rotateAround(new Vector2(0, 0), (3 / 2) * Math.PI)
    .normalize();

  let u2 = new Vector2(2, -1);
  let w2 = new Vector2(2, 0);

  //othogonal proj u1 onto line L
  $: proj_u1 = dir_L.clone().multiplyScalar(dir_L.clone().dot(u1) / dir_L.clone().dot(dir_L));

  //projection of u2 onto line L in direction of w2 gives proj
  $: temp = u2.clone().addScaledVector(w2, -4);
  $: proj_u2 = lineLineIntersection(temp, u2, start_L, end_L).clone();

  //vector used to draw right angle to u1
  $: v = u1.clone().sub(proj_u1);

  $: w2.normalize();

  //todo move this to a utils file?
  function lineLineIntersection(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
    var xcd = D.x - C.x;
    var ycd = D.y - C.y;
    var xac = A.x - C.x;
    proj_u1;
    var yac = A.y - C.y;
    var den = ycd * (B.x - A.x) - xcd * (B.y - A.y);
    var u0 = (xcd * yac - ycd * xac) / den;
    return new Vector2(A.x + u0 * (B.x - A.x), A.y + u0 * (B.y - A.y));
  }
</script>

<!-- LEFT PANEL : orthogonal -->

<Canvas2D gridType={GridType.Square} zoom={1.6}>
  <!-- L1 -->
  <Line2D start={start_L} end={end_L} color={PrimeColor.blue} />

  <!-- guide -->
  <Line2D start={u1} end={proj_u1} isDashed color={PrimeColor.darkGreen} />

  <!-- u1 -->
  <Point2D position={u1} color={PrimeColor.raspberry}/>
  <Draggable2D id="u1" bind:position={u1} color={PrimeColor.raspberry} snap/>
  <Latex2D
    latex={`\\mathbf{u}_1`}
    position={u1}
    offset={new Vector2(0, 0.3)}
    color={PrimeColor.raspberry}
  />

  <!-- w1 -->
  <Vector2D direction={w1} color={PrimeColor.yellow} />
  <Latex2D
    latex={`\\mathbf{w}_1`}
    position={w1}
    offset={new Vector2(0, -0.2)}
    color={PrimeColor.yellow}
  />

  <RightAngle vs={[v, dir_L]} origin={proj_u1} size={0.25} />
  <RightAngle vs={[w1, dir_L]} size={0.25} />

  <!-- T1(u1) -->
  <Point2D position={proj_u1} isSquare color={PrimeColor.blue} />
  <Latex2D
    latex={`T_1(\\mathbf{u}_1)`}
    position={proj_u1}
    offset={new Vector2(0.2, -0.3)}
    color={PrimeColor.blue}
  />

  <!-- RIGHT PANEL : projection in driection of w2 -->
  <svelte:fragment slot="splitCanvas">
    <!-- L1 -->
    <Line2D start={start_L} end={end_L} color={PrimeColor.blue} width={0.03} />

    <!-- guide line -->
    <Line2D start={u2} end={proj_u2} isDashed color={PrimeColor.darkGreen} />

    <!-- u2 -->
    <Point2D position={u2} color={PrimeColor.raspberry}/>
    <Draggable2D id="u2" bind:position={u2} color={PrimeColor.raspberry} snap/>
    <Latex2D
      latex={`\\mathbf{u}_2`}
      position={u2}
      offset={new Vector2(0, 0.3)}
      color={PrimeColor.raspberry}
    />

    <!-- w2 -->
    <Vector2D direction={w2} color={PrimeColor.yellow} />
    <Draggable2D id="w2" bind:position={w2} color={PrimeColor.yellow} snap/>
    <Latex2D
      latex={`\\mathbf{w}_2`}
      position={w2}
      offset={new Vector2(0, 0.3)}
      color={PrimeColor.yellow}
    />

    <!-- T2(u2) -->
    <Point2D position={proj_u2} isSquare color={PrimeColor.blue}/>
    <Latex2D
      latex={`T_2(\\mathbf{u}_2)`}
      position={proj_u2}
      offset={new Vector2(-0.4, 0.5)}
      color={PrimeColor.blue}
    />
  </svelte:fragment>
</Canvas2D>
