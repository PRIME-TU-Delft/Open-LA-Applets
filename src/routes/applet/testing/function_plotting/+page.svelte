<script lang="ts">
  import ExplicitFunction2D from '$lib/d3/ExplicitFunction2D.svelte';
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Vector2 } from 'three';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';

  const draggables = [new Draggable(new Vector2(1, 1), PrimeColor.raspberry)];

  const movableX3 = (x: number) => (x - draggables[0].position.x) ** 3 + draggables[0].position.y;

  const movableCircle = (x: number, y: number) =>
    x ** 2 + y ** 2 - draggables[0].position.lengthSq();
</script>

<Canvas2D {draggables}>
  <ExplicitFunction2D
    func={(x) => Math.log(x)}
    color={PrimeColor.darkGreen}
    showArrows
    stepSize={0.15}
  />
  <ExplicitFunction2D func={(x) => Math.sqrt(x ** 2)} color={PrimeColor.darkGreen} />
  <ExplicitFunction2D func={movableX3} color={PrimeColor.raspberry} />

  <ImplicitFunction2D
    zeroFunc={(x, y) =>
      x ** 2 / 3 ** 2 +
      y ** 2 / 2 ** 2 -
      (2 * x * y * Math.cos(2.2)) / (3 * 2) -
      Math.sin(2.2) ** 2}
    color={PrimeColor.blue}
    stepSize={0.1}
    showArrows
  />
  <ImplicitFunction2D zeroFunc={movableCircle} color={PrimeColor.raspberry} />

  <ImplicitFunction2D
    zeroFunc={(x, y) => x * x + y * y - 4}
    yMin={-2.1}
    yMax={2.1}
    xMin={-2.1}
    xMax={2.1}
    color={PrimeColor.darkGreen}
  />

  <ParameterizedFunction2D
    xFunc={(t) => Math.sin(t)}
    yFunc={(t) => Math.cos(t)}
    color={PrimeColor.yellow}
  />
</Canvas2D>
