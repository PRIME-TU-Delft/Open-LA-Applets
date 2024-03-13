<script lang="ts">
  import {
    RightAngle,
    Canvas2D,
    Latex2D,
    Vector2D,
    Draggable2D,
    Line2D,
    Point2D
  } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Formula } from '$lib/utils/Formulas';
  import { snapPointToLine } from '$lib/utils/MathLib';

  let formulas: Formula[] = [];

  let P = new Vector2(2, 1.5);
  $: Q = new Vector2(6, -0.5);
  $: PQ = Q.clone().sub(P);
  let N = new Vector2(1, 2);

  let L_dir = new Vector2(N.y, N.clone().x * -1);
  let L_start = L_dir.clone().multiplyScalar(-10).add(P);
  let L_end = L_dir.clone().multiplyScalar(10).add(P);
  let L_label = L_dir.clone().multiplyScalar(4).add(new Vector2(0, 2));

  function round(x: number) {
    return Math.round(x * 100) / 100;
  }

  function setFormulas(n: Vector2, pq: Vector2) {
    const f1 = new Formula(
      '\\mathbf{n} = \\begin{bmatrix} ' + round(n.x) + ' \\\\ ' + round(n.y) + ' \\end{bmatrix}'
    );
    const f2 = new Formula(
      '\\overrightarrow{PQ} = \\begin{bmatrix} ' +
        round(pq.x) +
        ' \\\\ ' +
        round(pq.y) +
        ' \\end{bmatrix}'
    );
    const f3 = new Formula('\\mathbf  {n} \\cdot \\overrightarrow{PQ} = ' + round(n.dot(pq)));

    formulas = [f1, f2, f3];
  }

  function snapQ(point: Vector2) {
    let result = snapPointToLine(point, L_start, L_end, 0.2)

    if (result !== null) {
      Q = result;
      PQ = Q.clone().sub(P);
    }
    setFormulas(N, PQ);
  }

  $: snapQ(Q);
</script>

<Canvas2D zoom={0.9} {formulas}>
  <Draggable2D id="normal_equation_line1" bind:position={Q} color={PrimeColor.raspberry} />

  <!-- RightAngle -->
  <RightAngle vs={[N, PQ]} size={0.3} lineWidth={0.02} origin={P} />

  <!-- Line L-->
  <Line2D start={L_start} end={L_end} color={PrimeColor.cyan} />
  <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

  <!-- Vectors -->
  <Vector2D origin={P} direction={PQ} length={PQ.length()} color={PrimeColor.darkGreen} />

  <Vector2D origin={P} direction={N} length={N.length()} color={PrimeColor.blue}>
    <Latex2D
      latex={'\\mathbf{n}'}
      position={N.clone().add(P).add(new Vector2(0.1, 0.25))}
      color={PrimeColor.blue}
    />
  </Vector2D>

  <!-- Points -->
  <Point2D position={P} color={PrimeColor.yellow} />
  <Latex2D
    latex={'P'}
    position={P.clone().add(new Vector2(-0.1, -0.2))}
    color={PrimeColor.yellow}
  />

  <Point2D position={Q} color={PrimeColor.raspberry} />
  <Latex2D latex={'Q'} position={Q.clone().add(new Vector2(-0.1, -0.2))} color={PrimeColor.raspberry} />
</Canvas2D>
