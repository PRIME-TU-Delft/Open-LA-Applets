<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal } from '$lib/threlte-components';
  import { Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders } from '$lib/utils/Slider';
  import { Vector3 } from 'three';

  const normal = new Vector3(1, 3, 1).normalize();
  let sliders = new Sliders().addSlider(1, 1, 5, 0.5).addSlider(0, -5, 0, 0.5);
  let formulas: Formulas[] = [];

  function setFormulas(x: number, y: number) {
    const f1 = new Formulas(`1x + 1y + (3 ${x < 0 ? '' : '+'}\\$)z = 0`, x, PrimeColor.red);
    const f2 = new Formulas(
      `1x + 1y + (3 ${sliders.y < 0 ? '' : '+'}\\$)z = 0`,
      y,
      PrimeColor.yellow
    );

    return [f1, f2];
  }

  $: formulas = setFormulas(sliders.x, sliders.y);
</script>

<Canvas3D
  {formulas}
  cameraPosition={new Vector3(11.63, 3.66, 12.3)}
  bind:sliders
  title="Two planes without a point in common."
>
  <AutoPlane values={sliders.values} let:value let:planeSegment let:color>
    <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
  </AutoPlane>

  <Axis3D />
</Canvas3D>
