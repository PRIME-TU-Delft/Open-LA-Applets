<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import Line2D from '$lib/d3/Line2D.svelte';
  import Point2D from '$lib/d3/Point2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { round, snapPointToLine } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  const P = new Vector2(2, 1.5);
  const N = new Vector2(1, 2);

  let L_dir = new Vector2(N.y, N.clone().x * -1);
  let L_start = L_dir.clone().multiplyScalar(-10).add(P);
  let L_end = L_dir.clone().multiplyScalar(10).add(P);
  let L_label = L_dir.clone().multiplyScalar(4).add(new Vector2(0, 2));

  function snapFn(v: Vector2) {
    return snapPointToLine(v, L_start, L_end, 1);
  }

  const draggables = [new Draggable(new Vector2(6, -0.5), PrimeColor.raspberry, 'Q', snapFn)];

  const Q = $derived(draggables[0].position);
  const PQ = $derived(draggables[0].position.clone().sub(P));

  const f1 = $derived(
    new Formula(
      '\\mathbf{n} = \\begin{pmatrix} ' + round(N.x) + ' \\\\ ' + round(N.y) + ' \\end{pmatrix}'
    )
  );
  const f2 = $derived(
    new Formula(
      '\\overrightarrow{PQ} = \\begin{pmatrix} ' +
        round(PQ.x) +
        ' \\\\ ' +
        round(PQ.y) +
        ' \\end{pmatrix}'
    )
  );
  const f3 = $derived(new Formula('\\mathbf{n} \\cdot \\overrightarrow{PQ} = ' + round(N.dot(PQ))));
</script>

<Canvas2D {draggables} cameraZoom={0.9} formulas={[f1, f2, f3]}>
  <!-- RightAngle -->
  <RightAngle2D vs={[N, PQ]} size={0.3} lineWidth={0.02} origin={P} />

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
  <Latex2D latex="P" position={P} offset={new Vector2(-0.1, -0.2)} color={PrimeColor.yellow} />

  <Latex2D latex="Q" position={Q} offset={new Vector2(-0.1, -0.2)} color={PrimeColor.raspberry} />
</Canvas2D>
