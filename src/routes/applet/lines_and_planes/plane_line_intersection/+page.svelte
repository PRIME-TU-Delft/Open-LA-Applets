<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';
  import { Vector3 } from 'three';

  let sliders = new Sliders().addSlider(-0.6).addSlider(0.5).addSlider(1);

  let formulas: Formulas[] = [];

  function setFormulas(x: number, y: number, z: number) {
    const f1 = new Formulas('\\$x + 1y + 1z = 0', x, PrimeColor.red);
    const f2 = new Formulas('\\$x + 1y + 1z = 0', y, PrimeColor.yellow);
    const f3 = new Formulas('\\$x + 1y + 1z = 0', z, PrimeColor.green);

    return [f1, f2, f3];
  }

  $: formulas = setFormulas(sliders.x, sliders.y, sliders.z);
</script>

<Canvas3D
  cameraPosition={new Vector3(7.29, -4.94, 14.91)}
  {formulas}
  zoom={37}
  bind:sliders
  title="Two planes with a line of intersection."
>
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
    />
  {/if}

  <Axis3D axisLength={7} />
</Canvas3D>
