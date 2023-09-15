<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D } from '$lib/p5-components';
  import Draggables from '$lib/p5-components/components/Draggables.svelte';
  import { GridType } from '$lib/p5-components/components/Grids';
  import RightAngle from '$lib/p5-components/components/RightAngle.svelte';
  import Vector from '$lib/p5-components/components/Vector.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';
  import LatexUI from '$lib/components/Latex.svelte';

  //todo consistant var naming -> camelcase or __
  //todo move labels
  //todo make version of grid class with only snap function so orthogonality check works

  //vars for static section
  let o_static = new Vector2(-3, 0);

  let w_static = new Vector2(1.5, 3);
  let v_static = new Vector2(2, -1);

  let vPlusW_static = v_static.clone().add(w_static);
  let vMinusW_static = v_static.clone().sub(w_static);

  //vars for interactive section
  let origin = new Vector2(1.5, 0);

  let w_plus_o = new Vector2(2, 3);
  const wDefault = new Vector2(2, 3);
  //w is calculated this way because a draggable takes a global position, not a vector relative to origin
  //TODO rename var to make this more logical
  $: w = w_plus_o.clone().sub(origin);

  let v_plus_o = new Vector2(3.5, -2);
  const vDefault = new Vector2(3.5, -2);
  $: v = v_plus_o.clone().sub(origin);

  $: vPlusW = v.clone().add(w);
  $: vMinusW = v.clone().sub(w);

  // keeps track of orthogonality
  $: isOrthogonal = Math.abs(w.dot(v)) <= 0.00000000001 && !v.equals(w);
</script>

<Canvas2D gridType={GridType.squareGrid}>
  <!-- Interactive side -->
  <Draggables snap bind:position={w_plus_o} defaultPosition={wDefault} color={PrimeColor.green} />
  <Draggables
    snap
    bind:position={v_plus_o}
    defaultPosition={vDefault}
    color={PrimeColor.ultramarine}
  />

  <!-- Arcs -->
  <!-- <Arc2D origin={origin_interactive} points={[v, w]} distance={0.75} color={PrimeColor.green} /> -->
  <RightAngle {origin} vs={[v, w]} />

  <!-- Bases -->
  <Vector2D {origin} direction={v} length={v.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'v'}
      offset={new Vector2(-0.2, 0.5)}
      color={PrimeColor.ultramarine}
    />
  </Vector2D>
  <Vector2D {origin} direction={w} length={w.length()} color={PrimeColor.green} let:endPoint>
    <Latex2D
      position={endPoint}
      latex={'w'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.green}
    />
  </Vector2D>

  <!-- v+w -->
  <Vector2D
    {origin}
    direction={vPlusW}
    length={vPlusW.length()}
    color={PrimeColor.red}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'v + w'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>

  <!-- v-w -->
  <Vector2D
    origin={w.clone().add(origin)}
    direction={vMinusW}
    length={vMinusW.length()}
    color={PrimeColor.yellow}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'v - w'}
      offset={new Vector2(-0.2, -0.2)}
      color={PrimeColor.yellow}
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

  <!-- Static part of image -->

  <RightAngle origin={o_static} vs={[v_static, w_static]} />

  <!-- static Bases -->
  <Vector2D
    origin={o_static}
    direction={v_static}
    length={v_static.length()}
    color={PrimeColor.ultramarine}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'v'}
      offset={new Vector2(-0.2, 0.5)}
      color={PrimeColor.ultramarine}
    />
  </Vector2D>
  <Vector2D
    origin={o_static}
    direction={w_static}
    length={w_static.length()}
    color={PrimeColor.green}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'w'}
      offset={new Vector2(-0.2, 0.2)}
      color={PrimeColor.green}
    />
  </Vector2D>

  <!-- static v+w -->
  <Vector2D
    origin={o_static}
    direction={vPlusW_static}
    length={vPlusW_static.length()}
    color={PrimeColor.red}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'v + w'}
      offset={new Vector2(0.2, 0.2)}
      color={PrimeColor.red}
    />
  </Vector2D>

  <!-- static v-w -->
  <Vector2D
    origin={w_static.clone().add(o_static)}
    direction={vMinusW_static}
    length={vMinusW_static.length()}
    color={PrimeColor.yellow}
    let:endPoint
  >
    <Latex2D
      position={endPoint}
      latex={'v - w'}
      offset={new Vector2(-0.2, -0.2)}
      color={PrimeColor.yellow}
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

  <div slot="formulas">
    {#if isOrthogonal}
      <LatexUI params={[v.x]} latex={' v + w = v - w'} />
    {:else}
      <LatexUI params={[w.y]} latex={' v + w \\neq v - w'} />
    {/if}
  </div>
</Canvas2D>
