<script lang="ts">
  import {
    AutoPlane,
    Axis3D,
    Canvas3D,
    PlaneFromNormal,
    Point3D,
    Vector3D
  } from '$lib/threlte-components';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';
  import { Vector3 } from 'three';

  let sliders = new Sliders().addSlider(0.5).addSlider(1);
  let formulas: Formula[] = [];

  function setFormulas(x: number, y: number) {
    const f0 = new Formula('P_1 = 0.5x + \\$y + 1z = 0', -1, PrimeColor.darkGreen);
    const f1 = new Formula('P_2 = \\$x + 1y + 1z = 0', x, PrimeColor.red);
    const f2 = new Formula('P_3 = \\$x + 1y + 1z = 0', y, PrimeColor.yellow);

    return [f0, f1, f2];
  }

  $: formulas = setFormulas(sliders.x, sliders.y);
</script>

<Canvas3D
  cameraPosition={new Vector3(16.14, 3.31, 5.35)}
  {formulas}
  zoom={41}
  bind:sliders
  title="Two planes with a line of intersection."
>
  <AutoPlane values={sliders.values} let:value let:planeSegment let:color>
    <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
  </AutoPlane>

  <!-- Plane x Rotated by 90 deg -->
  <PlaneFromNormal normal={new Vector3(0.5, -1, 1)} color={PrimeColor.darkGreen} />

  {#if !sliders.allEqualValue}
    <Vector3D
      color={PrimeColor.blue}
      length={11.5}
      origin={new Vector3(0, -4, 4)}
      direction={new Vector3(0, 1, -1)}
      radius={0.2}
      hideHead
    />

    <Point3D color={PrimeColor.blue} />
  {/if}

  <Axis3D axisLength={7} />
</Canvas3D>
