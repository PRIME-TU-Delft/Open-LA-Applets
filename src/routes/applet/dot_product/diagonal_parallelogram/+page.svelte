<script lang="ts">
  import { Canvas2D, Latex2D, RightAngle, Vector2D } from '$lib/d3-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import Draggable from '$lib/d3-components/Draggable.svelte';
  import { GridType } from '$lib/d3-components/grids/GridTypes';
  import { Formula } from '$lib/utils/Formulas';

  //[] todo consistant var naming -> camelcase or __
  //[X] todo move labels
  //[] todo make version of grid class with only snap function so orthogonality check works
  //[X] todo new formula slot
  //[] refactor length of this file

  

  let formulas: Formula[] = [];


  //vars for static section
  let o_static = new Vector2(-3, 0);

  let w_static = new Vector2(1.5, 3);
  let v_static = new Vector2(2, -1);

  let vPlusW_static = v_static.clone().add(w_static);
  let vMinusW_static = v_static.clone().sub(w_static);

  //vars for interactive section
  let origin = new Vector2(1.5, 0);

  let w_plus_o = new Vector2(2, 3);
  //w is calculated this way because a draggable takes a global position, not a vector relative to origin
  //TODO rename var to make this more logical
  $: w = w_plus_o.clone().sub(origin);

  let v_plus_o = new Vector2(3.5, -2);
  $: v = v_plus_o.clone().sub(origin);

  $: vPlusW = v.clone().add(w);
  $: vMinusW = v.clone().sub(w);

  // keeps track of orthogonality
  $: isOrthogonal = Math.abs(w.clone().normalize().dot(v.clone().normalize())) <= 0.05 && !v.equals(w);

  function setFormulas( b: boolean) {

    if ( b )  {
      const f3 = new Formula('|v| = |w|');
      formulas = [f3]
    } else {
      const f3 = new Formula('|v| != |w|');
      formulas = [ f3]
    }
  }

  $: setFormulas(isOrthogonal);
</script>

<Canvas2D gridType={GridType.None} {formulas}>
  <!-- Interactive side  of image -->

  <Draggable id={'\\mathbf{w+o}'} bind:position={w_plus_o} color={PrimeColor.darkGreen} />
  <Draggable
    id={'\\mathbf{v+o}'}
    bind:position={v_plus_o}
    color={PrimeColor.cyan}
  />

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





  <!-- Static part of image -->

  <!-- static Bases -->
  <Vector2D
    origin={o_static}
    direction={v_static}
    length={v_static.length()}
    color={PrimeColor.cyan}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{v}'}
      offset={new Vector2(-0.4, 0.5)}
      color={PrimeColor.cyan}
    />
  </Vector2D>
  <Vector2D
    origin={o_static}
    direction={w_static}
    length={w_static.length()}
    color={PrimeColor.darkGreen}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'\\mathbf{w}'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.darkGreen}
    />
  </Vector2D>

  <!-- static v+w -->
  <Vector2D
    origin={o_static}
    direction={vPlusW_static}
    length={vPlusW_static.length()}
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

  <!-- static v-w -->
  <Vector2D
    origin={w_static.clone().add(o_static)}
    direction={vMinusW_static}
    length={vMinusW_static.length()}
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

  <!-- Static Helper lines -->
  <Vector2D
    origin={w_static.clone().add(o_static)}
    direction={v_static}
    length={v_static.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />
  <Vector2D
    origin={v_static.clone().add(o_static)}
    direction={w_static}
    length={w_static.length()}
    color={PrimeColor.black}
    isDashed
    hideHead
  />

  <RightAngle origin={o_static} vs={[v_static, w_static]} />

  <!-- <div slot="formulas">
    {#if isOrthogonal}
      <LatexUI params={[v.x]} latex={' v + w = v - w'} />
    {:else}
      <LatexUI params={[w.y]} latex={' v + w \\neq v - w'} />
    {/if}
  </div> -->
</Canvas2D>
