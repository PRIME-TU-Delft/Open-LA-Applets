<script lang="ts">
  import { Formula } from '$lib/utils/Formulas';
  import { round, snapPointToLine } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import Latex2D from '$lib/d3/Latex2D.svelte';
  import RightAngle2D from '$lib/d3/RightAngle2D.svelte';
  import Vector2D from '$lib/d3/Vector2D.svelte';
  import StaticImage from './StaticImage.svelte';

  const SNAP_DISTANCE = 1;

  function snap_w(vec: Vector2): Vector2 {
    return snapPointToLine(vec, orthV.clone().multiplyScalar(-1), orthV, SNAP_DISTANCE);
  }

  function snap_v(vec: Vector2): Vector2 {
    return snapPointToLine(vec, orthW.clone().multiplyScalar(-1), orthW, SNAP_DISTANCE);
  }

  const draggables = [
    new Draggable(new Vector2(1.5, 3), PrimeColor.darkGreen, '', snap_w),
    new Draggable(new Vector2(2, -1), PrimeColor.cyan, '', snap_v)
  ];
  const w = $derived(draggables[0].position);
  const v = $derived(draggables[1].position);

  const orthV = $derived(new Vector2(v.y, v.clone().x * -1).multiplyScalar(20)); //line orth to v
  const orthW = $derived(new Vector2(w.y, w.clone().x * -1).multiplyScalar(20)); //line orth to v

  const vPlusW = $derived(v.clone().add(w));
  const vMinusW = $derived(v.clone().sub(w));

  // keeps track of orthogonality
  const isOrthogonal = $derived(
    Math.abs(w.clone().normalize().dot(v.clone().normalize())) <= 0.05 && !v.equals(w)
  );

  const formulas = [
    new Formula(`{\\$1} = \\$2`)
      .addParam(1, ' | \\mathbf{v + w} |', PrimeColor.raspberry)
      .addParam(2, '|\\mathbf{v - w}|', PrimeColor.orange)
  ];

  const splitFormulas = $derived.by(() => {
    const plus = ' | \\mathbf{v + w} |';
    const min = '|\\mathbf{v - w}|';

    const f1 = new Formula(`\\$1 ${isOrthogonal ? '=' : '\\neq'} \\$2`)
      .addParam(1, plus, PrimeColor.raspberry)
      .addParam(2, min, PrimeColor.orange);

    const f2 = new Formula(`\\$1 \\cdot \\$2 = \\$3`)
      .addParam(1, '|\\mathbf{v}|', PrimeColor.blue)
      .addParam(2, '|\\mathbf{w}|', PrimeColor.darkGreen)
      .addParam(3, round(w.dot(v)), PrimeColor.raspberry);

    return [f1, f2];
  });
</script>

<Canvas2D
  title="Addition and subtraction of 2 vectors"
  cameraZoom={1.5}
  cameraPosition={new Vector2(2, 1)}
  splitCanvas2DProps={{
    draggables,
    enablePan: false,
    cameraZoom: 1.5,
    cameraPosition: new Vector2(2, 1)
  }}
  {formulas}
  {splitFormulas}
  enablePan={false}
  showFormulasDefault
>
  <!-- MARK: STATIC -->
  <StaticImage />

  <!-- MARK: INTERACTIVE -->
  {#snippet splitCanvas2DChildren()}
    <!-- Bases -->
    <Vector2D direction={v} length={v.length()} color={PrimeColor.cyan}>
      <Latex2D
        latex={'\\mathbf{v}'}
        offset={v.clone().normalize().multiplyScalar(1.5).add(new Vector2(0, 0.2))}
        color={PrimeColor.cyan}
      />
    </Vector2D>
    <Vector2D direction={w} length={w.length()} color={PrimeColor.darkGreen}>
      <Latex2D
        latex={'\\mathbf{w}'}
        offset={w.clone().normalize().multiplyScalar(1.5).add(new Vector2(0.1, 0))}
        color={PrimeColor.darkGreen}
      />
    </Vector2D>

    <!-- v+w -->
    <Vector2D direction={vPlusW} length={vPlusW.length()} color={PrimeColor.raspberry}>
      {#snippet children(endPoint)}
        <Latex2D
          position={endPoint}
          latex={'\\mathbf{v + w}'}
          offset={new Vector2(0.2, 0.2)}
          color={PrimeColor.raspberry}
        />
      {/snippet}
    </Vector2D>

    <!-- v-w -->
    <Vector2D origin={w} direction={vMinusW} length={vMinusW.length()} color={PrimeColor.orange}>
      {#snippet children(endPoint)}
        <Latex2D
          position={endPoint}
          latex={'\\mathbf{v - w}'}
          offset={new Vector2(-0.2, -0.2)}
          color={PrimeColor.orange}
        />
      {/snippet}
    </Vector2D>

    <!-- Helper lins -->
    <Vector2D
      origin={w}
      direction={v}
      length={v.length()}
      color={PrimeColor.black}
      isDashed
      hideHead
    />
    <Vector2D
      origin={v}
      direction={w}
      length={w.length()}
      color={PrimeColor.black}
      isDashed
      hideHead
    />
    <RightAngle2D vs={[v, w]} />
  {/snippet}
</Canvas2D>
