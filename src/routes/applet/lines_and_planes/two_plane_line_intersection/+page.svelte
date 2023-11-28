<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';
  import { Vector3 } from 'three';

  let sliders = new Sliders().addSlider(0, -10, 0).addSlider(1, 1, 10);
  let formulas: Formulas[] = [];

  function setFormulas(x: number, y: number) {
    const f1 = new Formulas('\\$x + 1y + 1z = 0', x, PrimeColor.red);
    const f2 = new Formulas('\\$x + 1y + 1z = 0', y, PrimeColor.yellow);

    return [f1, f2];
  }

  $: formulas = setFormulas(sliders.x, sliders.y);
</script>

<Canvas3D bind:sliders {formulas} title="Two planes with a line of intersection.">
  <AutoPlane values={sliders.values} let:value let:planeSegment let:color>
    <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
  </AutoPlane>

  {#if !sliders.allEqualValue}
    <Vector3D
      color={PrimeColor.ultramarine}
      length={11.5}
      origin={new Vector3(0, -4, 4)}
      direction={new Vector3(0, 1, -1)}
      radius={0.2}
      hideHead
      alwaysOnTop
    />
  {/if}

  <Axis3D />
</Canvas3D>
