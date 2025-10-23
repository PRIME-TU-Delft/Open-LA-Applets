<script lang="ts">
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import Parallelogram2D from '$lib/d3/Parallelogram2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector2 } from 'three';

  let func = (x: number) => {
    return -Math.log(x / 3 + 1) + 3;
  };
  let xlSnapFunc = (p: Vector2) => {
    let x = Math.min(p.x, xR);
    return new Vector2(x, func(x));
  };
  let xrSnapFunc = (p: Vector2) => {
    let x = Math.max(p.x, xL);
    return new Vector2(x, 0);
  };

  const draggables = [
    new Draggable(new Vector2(2, func(2)), PrimeColor.orange, 'x_L', xlSnapFunc),
    new Draggable(new Vector2(5, 0), PrimeColor.orange, 'x_R', xrSnapFunc)
  ];

  const xL = $derived(draggables[0].position.x);
  const xR = $derived(draggables[1].position.x);
</script>

<Canvas2D {draggables} cameraPosition={new Vector2(4, 2)} title={'Left rectangle rule'}>
  <ExplicitFunction2D {func} color={PrimeColor.blue} />

  <Parallelogram2D
    points={[new Vector2(xL, 0), new Vector2(xR, 0), new Vector2(xL, func(xL))]}
    color={PrimeColor.orange + PrimeColor.opacity(0.6)}
    strokeColor={PrimeColor.orange}
    strokeWidth={1}
  />

  <!-- <Point2D position={new Vector2(xL, func(xL))} color={PrimeColor.orange} />  -->

  <!-- <Latex2D position={new Vector2(xL, 0)} latex={"x_L"} />
    <Latex2D position={new Vector2(xR, 0)} latex={"x_R"} /> -->
</Canvas2D>
