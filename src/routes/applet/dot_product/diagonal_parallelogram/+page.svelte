<script lang="ts">
  import { Arc2D, Canvas2D, Latex2D, Vector2D } from '$lib/p5-components';
  import Draggables from '$lib/p5-components/components/Draggables.svelte';
  import { GridType } from '$lib/p5-components/components/Grids';
    import RightAngle from '$lib/p5-components/components/RightAngle.svelte';
  import Vector from '$lib/p5-components/components/Vector.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  //todo consistant var naming -> camelcase or __

  //vars for static section
  let o_static = new Vector2(-4, 0)

  let w_static = new Vector2(1.5, 3);
  let v_static = new Vector2(4, -1);

  let vPlusW_static = v_static.clone().add(w_static);
  let vMinusW_static = v_static.clone().sub(w_static);


  //vars for interactive section
  let origin = new Vector2(2, 0);

  let w_plus_o = new Vector2(3, 4);
  const wDefault = new Vector2(3, 4);
  //w is calculated this way because a draggable takes a global position, not a vector relative to origin
  //TODO rename var to make this more logical
  $: w = w_plus_o.clone().sub(origin);

  let v_plus_o = new Vector2(4, -2.5);
  const vDefault = new Vector2(4, -2.5);
  $: v = v_plus_o.clone().sub(origin);

  $: vPlusW = v.clone().add(w);
  $: vMinusW = v.clone().sub(w);

  //todo move labels to centers of vectors


</script>

<Canvas2D gridType={GridType.squareGrid}>
  <Draggables snap bind:position={w_plus_o} defaultPosition={wDefault} color={PrimeColor.green} />
  <Draggables snap bind:position={v_plus_o} defaultPosition={vDefault} color={PrimeColor.ultramarine} />

  <!-- Arcs -->
  <!-- <Arc2D origin={origin_interactive} points={[v, w]} distance={0.75} color={PrimeColor.green} /> -->
  <RightAngle origin={origin} vs={[v,w]}/>

  <!-- Bases -->
  <Vector2D origin={origin} direction={v} length={v.length()} color={PrimeColor.ultramarine} let:endPoint>
    <Latex2D position={endPoint} latex={'v'} offset={new Vector2(-0.2, 0.5)} color={PrimeColor.ultramarine} />
  </Vector2D>
  <Vector2D origin={origin} direction={w} length={w.length()} color={PrimeColor.green} let:endPoint>
    <Latex2D position={endPoint} latex={'w'} offset={new Vector2(-0.2, 0.2)} color={PrimeColor.green}/>
  </Vector2D>

  <!-- v+w -->
  <Vector2D origin={origin} direction={vPlusW} length={vPlusW.length()} color={PrimeColor.red} let:endPoint>
    <Latex2D position={endPoint} latex={'v + w'} offset={new Vector2(0.2, 0.2)} color={PrimeColor.red} />
  </Vector2D>

  <!-- v-w -->
  <Vector2D
    origin={w.clone().add(origin)}
    direction={vMinusW}
    length={vMinusW.length()}
    color={PrimeColor.yellow}
    let:endPoint
  >
    <Latex2D position={endPoint} latex={'v - w'} offset={new Vector2(-0.2, -0.2)} color={PrimeColor.yellow}/>
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




  <!-- Non interactive part of image -->

      <RightAngle origin={origin} vs={[v,w]}/>

      <!-- Bases -->
      <Vector2D origin={origin} direction={v} length={v.length()} color={PrimeColor.ultramarine} let:endPoint>
        <Latex2D position={endPoint} latex={'v'} offset={new Vector2(-0.2, 0.5)} color={PrimeColor.ultramarine} />
      </Vector2D>
      <Vector2D origin={origin} direction={w} length={w.length()} color={PrimeColor.green} let:endPoint>
        <Latex2D position={endPoint} latex={'w'} offset={new Vector2(-0.2, 0.2)} color={PrimeColor.green}/>
      </Vector2D>

      <!-- v+w -->
      <Vector2D origin={origin} direction={vPlusW} length={vPlusW.length()} color={PrimeColor.red} let:endPoint>
        <Latex2D position={endPoint} latex={'v + w'} offset={new Vector2(0.2, 0.2)} color={PrimeColor.red} />
      </Vector2D>

      <!-- v-w -->
      <Vector2D
        origin={w.clone().add(origin)}
        direction={vMinusW}
        length={vMinusW.length()}
        color={PrimeColor.yellow}
        let:endPoint
      >
        <Latex2D position={endPoint} latex={'v - w'} offset={new Vector2(-0.2, -0.2)} color={PrimeColor.yellow}/>
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


</Canvas2D>
