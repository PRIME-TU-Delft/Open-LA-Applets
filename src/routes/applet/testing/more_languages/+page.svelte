<script lang="ts">
  import ImplicitFunction2D from '$lib/d3/ImplicitFunction2D.svelte';
  import Canvas2D from '$lib/d3/Canvas2D.svelte';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Draggable } from '$lib/controls/Draggables.svelte';
  import { Vector2 } from 'three';
  import ParameterizedFunction2D from '$lib/d3/ParameterizedFunction2D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { _ } from 'svelte-i18n';

  const draggables = [new Draggable(new Vector2(1, 1), PrimeColor.raspberry)];

  const movableCircle = (x: number, y: number) =>
    x ** 2 + y ** 2 - draggables[0].position.lengthSq();

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\text{\\$1}').addAutoParam(
      $_('applets.testing.more_languages.formula')
    );

    return [f1];
  });
</script>

<Canvas2D {draggables} {formulas} title={$_('applets.testing.more_languages.title')}>
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
