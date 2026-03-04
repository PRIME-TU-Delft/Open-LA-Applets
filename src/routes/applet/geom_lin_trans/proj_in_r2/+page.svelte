<script lang="ts">
  import { Vector2 } from 'three';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import { Draggable } from '$lib/controls/Draggables.svelte';

  const dir_L = new Vector2(2, 1);
  const start_L = dir_L.clone().multiplyScalar(-30);
  const end_L = dir_L.clone().multiplyScalar(30);

  const draggableLeft = [
    new Draggable(new Vector2(2, 3), PrimeColor.raspberry, 'u1', Draggable.snapToGrid)
  ];
  const u1 = $derived(draggableLeft[0].value);

  const w1 = dir_L
    .clone()
    .rotateAround(new Vector2(0, 0), (3 / 2) * Math.PI)
    .normalize();

  const draggableRight = [
    new Draggable(new Vector2(2, -1), PrimeColor.raspberry, 'u2', Draggable.snapToGrid),
    new Draggable(new Vector2(1, 0), PrimeColor.yellow, 'w2', (v) => v.normalize())
  ];

  const u2 = $derived(draggableRight[0].value);
  const w2 = $derived(draggableRight[1].value);

  //othogonal proj u1 onto line L
  const proj_u1 = $derived(
    dir_L.clone().multiplyScalar(dir_L.clone().dot(u1) / dir_L.clone().dot(dir_L))
  );

  //projection of u2 onto line L in direction of w2 gives proj
  const temp = $derived(u2.clone().addScaledVector(w2, -4));
  const proj_u2 = $derived(lineLineIntersection(temp, u2, start_L, end_L).clone());

  //vector used to draw right angle to u1
  const v = $derived(u1.clone().sub(proj_u1));

  //todo move this to a utils file?
  function lineLineIntersection(A: Vector2, B: Vector2, C: Vector2, D: Vector2) {
    const xcd = D.x - C.x;
    const ycd = D.y - C.y;
    const xac = A.x - C.x;
    const yac = A.y - C.y;

    const den = ycd * (B.x - A.x) - xcd * (B.y - A.y);
    const u0 = (xcd * yac - ycd * xac) / den;
    return new Vector2(A.x + u0 * (B.x - A.x), A.y + u0 * (B.y - A.y));
  }
</script>

<!-- LEFT PANEL : orthogonal -->
<Canvas2D
  draggables={draggableLeft}
  splitCanvas2DProps={{ draggables: draggableRight }}
  cameraZoom={1.6}
>
  <!-- L1 -->
  <Line2D start={start_L} end={end_L} color={PrimeColor.blue} />

  <!-- guide -->
  <Line2D start={u1} end={proj_u1} isDashed color={PrimeColor.darkGreen} />

  <!-- u1 -->
  <Point2D position={u1} color={PrimeColor.raspberry} />
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

  <RightAngle2D vs={[v, dir_L]} origin={proj_u1} size={0.25} />
  <RightAngle2D vs={[w1, dir_L]} size={0.25} />

  <!-- T1(u1) -->
  <Point2D position={proj_u1} shape="square" color={PrimeColor.blue} />
  <Latex2D
    latex={`T_1(\\mathbf{u}_1)`}
    position={proj_u1}
    offset={new Vector2(0.2, -0.3)}
    color={PrimeColor.blue}
  />

  <!-- RIGHT PANEL : projection in driection of w2 -->
  {#snippet splitCanvas2DChildren()}
    <!-- L1 -->
    <Line2D start={start_L} end={end_L} color={PrimeColor.blue} width={0.03} />

    <!-- guide line -->
    <Line2D start={u2} end={proj_u2} isDashed color={PrimeColor.darkGreen} />

    <!-- u2 -->
    <Point2D position={u2} color={PrimeColor.raspberry} />
    <Latex2D
      latex={`\\mathbf{u}_2`}
      position={u2}
      offset={new Vector2(0, 0.3)}
      color={PrimeColor.raspberry}
    />

    <!-- w2 -->
    <Vector2D direction={w2} color={PrimeColor.yellow} />
    <Latex2D
      latex={`\\mathbf{w}_2`}
      position={w2}
      offset={new Vector2(0, 0.3)}
      color={PrimeColor.yellow}
    />

    <!-- T2(u2) -->
    <Point2D position={proj_u2} shape="square" color={PrimeColor.blue} />
    <Latex2D
      latex={`T_2(\\mathbf{u}_2)`}
      position={proj_u2}
      offset={new Vector2(-0.4, 0.5)}
      color={PrimeColor.blue}
    />
  {/snippet}
</Canvas2D>
