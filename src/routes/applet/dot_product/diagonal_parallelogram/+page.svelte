<script lang="ts">
  import { Canvas2D, Latex2D, Vector2D, Draggable2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2, Vector3 } from 'three';
  import { GridType } from '$lib/d3-components/grids/GridTypes';
  import { Formula } from '$lib/utils/Formulas';
  import RightAngle from '$lib/d3-components/RightAngle.svelte';
  import { snapPointToLine } from '$lib/utils/MathLib';
  import StaticImg from './staticImg.svelte';

  //[] todo consistant var naming -> camelcase or __

  const snap_distance = 0.5;

  let formulas: Formula[] = [];

  //vars for interactive section
  let origin = new Vector2(1.5, 0);

  let w_plus_o = new Vector2(2, 3); //vectors are calculated this way because a draggable takes a global position, not a vector relative to origin

  $: w = w_plus_o.clone().sub(origin);

  let v_plus_o = new Vector2(3.5, -2);
  $: v = v_plus_o.clone().sub(origin);

  $: orthV = new Vector2(v.y, v.clone().x * -1).multiplyScalar(20); //line orth to v
  $: orthW = new Vector2(w.y, w.clone().x * -1).multiplyScalar(20); //line orth to v

  function snap_v(_: Vector2) {
    let snap_v = snapPointToLine(v, orthW.clone().multiplyScalar(-1), orthW, snap_distance);
    if (snap_v != null) {
      v = snap_v;
      v_plus_o = v.clone().add(origin);
    }
  }

  function snap_w(_: Vector2) {
    let snap_w = snapPointToLine(w, orthV.clone().multiplyScalar(-1), orthV, snap_distance);
    if (snap_w != null) {
      w = snap_w;
      w_plus_o = w.clone().add(origin);
    }
  }

  function setFormulas(b: boolean) {
    const plus = ' | \\mathbf{v + w} |';
    const min = '|\\mathbf{v - w}|';
    if (b) {
      const f3 = new Formula('{\\$1} = \\$2')
        .addParam(1, plus, PrimeColor.raspberry)
        .addParam(2, min, PrimeColor.orange);
      formulas = [f3];
    } else {
      const f3 = new Formula('{\\$1}  \\neq \\$2')
        .addParam(1, plus, PrimeColor.raspberry)
        .addParam(2, min, PrimeColor.orange);
      formulas = [f3];
    }
  }

  $: snap_v(v);
  $: snap_w(w);

  $: vPlusW = v.clone().add(w);
  $: vMinusW = v.clone().sub(w);

  // keeps track of orthogonality
  $: isOrthogonal =
    Math.abs(w.clone().normalize().dot(v.clone().normalize())) <= 0.05 && !v.equals(w);

  $: setFormulas(isOrthogonal);
</script>

<Canvas2D gridType={GridType.None} {formulas}>
  <!-- Imported static side -->
  <StaticImg />
  <!-- Interactive side  of image -->

  <Draggable2D id="w+o" bind:position={w_plus_o} color={PrimeColor.darkGreen} />
  <Draggable2D id="v+o" bind:position={v_plus_o} color={PrimeColor.cyan} />

  <!-- Bases -->
  <Vector2D {origin} direction={v} length={v.length()} color={PrimeColor.cyan}>
    <Latex2D
      position={origin}
      latex={'\\mathbf{v}'}
      offset={v.clone().normalize().multiplyScalar(1.5).add(new Vector2(0, 0.2))}
      color={PrimeColor.cyan}
    />
  </Vector2D>
  <Vector2D {origin} direction={w} length={w.length()} color={PrimeColor.darkGreen}>
    <Latex2D
      position={origin}
      latex={'\\mathbf{w}'}
      offset={w.clone().normalize().multiplyScalar(1.5).add(new Vector2(0.1, 0))}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <!-- v+w -->
  <Vector2D
    {origin}
    direction={vPlusW}
    length={vPlusW.length()}
    color={PrimeColor.raspberry}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v + w}'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.raspberry}
    />
  </Vector2D>

  <!-- v-w -->
  <Vector2D
    origin={w.clone().add(origin)}
    direction={vMinusW}
    length={vMinusW.length()}
    color={PrimeColor.orange}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v - w}'}
      offset={new Vector2(-0.2, -0.2)}
      color={PrimeColor.orange}
    />
  </Vector2D>

  <!-- Helper lins -->
  <Vector2D
    origin={w.clone().add(origin)}
    direction={v}
    length={v.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />
  <Vector2D
    origin={v.clone().add(origin)}
    direction={w}
    length={w.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />
  <RightAngle {origin} vs={[v, w]} />
</Canvas2D>
