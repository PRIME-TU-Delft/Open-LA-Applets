<script lang="ts">
  import {
    Arc2D,
    Draggable2D,
    RightAngle,
    Canvas2D,
    Latex2D,
    Line2D,
    Vector2D
  } from '$lib/d3-components';
  import { Formula } from '$lib/utils/Formulas';
  import { isPointBelowLine, snapPointToLine } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let formulas: Formula[] = [];
  let v = new Vector2(2, 2 / 3);
  let L_start = v.clone().multiplyScalar(-20);
  let L_end = v.clone().multiplyScalar(20);
  let L_label = v.clone().normalize().multiplyScalar(5).add(new Vector2(-0.3, 0.3));

  let A_L = v.clone().multiplyScalar(1.5);

  let w_L = new Vector2(2.5, 2.5);
  let wL_sub_AL = w_L.clone().sub(A_L);

  let A_R = v.clone().multiplyScalar(-1.5);
  let w_R = new Vector2(-3.5, 0.5);
  let wR_sub_AR = w_R.clone().sub(A_R);

  let phiL_label = new Vector2(0.8, 2 / 3);
  let phiR_label = new Vector2(0.8, 2 / 3);

  function updateA(wl: Vector2, wr: Vector2) {
    let point = snapPointToLine(wl, L_start, L_end, 500);
    if (point === null) {
      return;
    }
    A_L = point;
    wL_sub_AL = w_L.clone().sub(A_L);

    point = snapPointToLine(wr, L_start, L_end, 500);
    if (point === null) {
      return;
    }
    A_R = point;
    wR_sub_AR = w_R.clone().sub(A_R);
  }

  function setFormulas(wL: Vector2, wR: Vector2) {
    const f1 = new Formula('v \\cdot w = \\$', v.clone().dot(wL) , PrimeColor.red);
    const f2 = new Formula('v \\cdot w = \\$', v.clone().dot(wR) , PrimeColor.red);

    formulas = [f1, f2];
  }

  function flipPhi(wL: Vector2, wR: Vector2) {

    if (isPointBelowLine(L_start, L_end, wL)) {
      
      phiL_label = new Vector2(1.1, 0.3);
    }
    else {
      phiL_label = new Vector2(0.8, 2 / 3);
    }

    if (isPointBelowLine(L_start, L_end, wR)) {
      phiR_label = new Vector2(1.1, 0.3);
    }
    else {
      phiR_label = new Vector2(0.8, 2 / 3);
    }
  }

  $: setFormulas(w_L, w_R);
  $: updateA(w_L, w_R)
  $: flipPhi(w_L, w_R)

</script>

<Canvas2D zoom={1.3} {formulas}>
  <Draggable2D id="angle_and_projection1" bind:position={w_L} color={PrimeColor.darkGreen} />
  <!-- Arcs -->
  <RightAngle vs={[wL_sub_AL, A_L]} lineWidth={0.03} origin={A_L} />

  <Arc2D points={[w_L, v]} distance={0.8} smallestAngle={true}/>
  <Latex2D latex={'\\varphi'} position={phiL_label} color={PrimeColor.black} />

  <!-- L /-->
  <Line2D start={L_start} end={L_end} color={PrimeColor.cyan} />
  <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

  <!-- Vector A -->
  <Vector2D direction={A_L} length={A_L.length()} color={PrimeColor.red} />
  <Latex2D latex={'A'} offset={A_L.clone().add(new Vector2(0, -0.2))} color={PrimeColor.black} />

  <!-- Vector v -->
  <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Latex2D
    latex={'\\mathbf{v}'}
    offset={v.clone().add(new Vector2(0, -0.2))}
    color={PrimeColor.blue}
  />

  <!-- Vector w -->
  <Vector2D direction={w_L} length={w_L.length()} color={PrimeColor.darkGreen} />
  <Latex2D
    latex={'\\mathbf{w}'}
    offset={w_L.clone().add(new Vector2(-0.4, 0.2))}
    color={PrimeColor.darkGreen}
  />

  <!-- Vector w_sub_A -->
  <Vector2D
    origin={A_L}
    direction={wL_sub_AL}
    length={wL_sub_AL.length()}
    color={PrimeColor.black}
    hideHead
    isDashed
  />
  <Latex2D latex={'B'} offset={w_L.clone().add(new Vector2(0.2, 0.2))} color={PrimeColor.black} />

  <svelte:fragment slot="splitCanvas">
    <Draggable2D id="angle_and_projection2" bind:position={w_R} color={PrimeColor.darkGreen} />
    <!-- Arcs -->
    <RightAngle vs={[wR_sub_AR, A_R]} lineWidth={0.03} origin={A_R} />

    <Arc2D points={[w_R, v]} distance={0.8} smallestAngle={true} />
    <Latex2D latex={'\\varphi'} position={phiR_label} color={PrimeColor.black} />

    <!-- L /-->
    <Line2D start={L_start} end={L_end} color={PrimeColor.cyan} />
    <Latex2D latex={'\\mathcal{L}'} position={L_label} color={PrimeColor.cyan} />

    <!-- Vector A -->
    <Vector2D direction={A_R} length={A_R.length()} color={PrimeColor.red} />
    <Latex2D latex={'A'} offset={A_R.clone().add(new Vector2(0, -0.2))} color={PrimeColor.black} />

    <!-- Vector v -->
    <Vector2D direction={v} length={v.length()} color={PrimeColor.blue} />
    <Latex2D
      latex={'\\mathbf{v}'}
      offset={v.clone().add(new Vector2(0, -0.2))}
      color={PrimeColor.blue}
    />

    <!-- Vector w -->
    <Vector2D direction={w_R} length={w_R.length()} color={PrimeColor.darkGreen} />
    <Latex2D
      latex={'\\mathbf{w}'}
      offset={w_R.clone().add(new Vector2(0.2, 0.3))}
      color={PrimeColor.darkGreen}
    />

    <!-- Vector wA -->
    <Vector2D
      origin={A_R}
      direction={wR_sub_AR}
      length={wR_sub_AR.length()}
      color={PrimeColor.black}
      hideHead
      isDashed
    />
    <Latex2D
      latex={'B'}
      offset={w_R.clone().add(new Vector2(-0.4, 0.2))}
      color={PrimeColor.black}
    />
  </svelte:fragment>
</Canvas2D>
