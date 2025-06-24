<script lang="ts">
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Vector2 } from 'three';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';

  const draggables = [new Draggable(new Vector2(1, 1), PrimeColor.raspberry)];

  let movableX3 = $derived(`y=(x-${draggables[0].position.x})^3+${draggables[0].position.y}`);

  let movableCircle = $derived(`x^2+y^2=${draggables[0].position.lengthSq()}`);
</script>

<Canvas2D {draggables}>
  <ExplicitFunction2D func="y=log(x)" color={PrimeColor.darkGreen} showArrows stepSize={0.15} />
  <ExplicitFunction2D func="y=sqrt(x^2)" color={PrimeColor.darkGreen} />
  <ExplicitFunction2D func={movableX3} color={PrimeColor.raspberry} />
  <ImplicitFunction2D
    func="x^2/3^2 + y^2/2^2 - (2*x*y*cos(2.2))/(3*2) = (sin(2.2))^2"
    color={PrimeColor.blue}
    stepSize={0.1}
    showArrows
  />
  <ImplicitFunction2D func={movableCircle} color={PrimeColor.raspberry} />

  <ParameterizedFunction2D xFunc={'sin(t)'} yFunc={'cos(t)'} color={PrimeColor.yellow} />
</Canvas2D>
