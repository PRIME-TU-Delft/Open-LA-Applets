<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal } from '$lib/threlte-components';
  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const normal = new Vector3(1, 3, 1).normalize();
  let controls = Controls.addSlider(1, 1, 5, 0.5).addSlider(0, -5, 0, 0.5);
  let formulas: Formula[] = [];

  function setFormulas(x: number, y: number) {
    const f1 = new Formula(`1x + 1y + (3 ${x < 0 ? '' : '+'}\\$)z = 0`, x, PrimeColor.raspberry);
    const f2 = new Formula(
      `1x + 1y + (3 ${controls[1] < 0 ? '' : '+'}\\$)z = 0`,
      y,
      PrimeColor.yellow
    );

    return [f1, f2];
  }

  $: formulas = setFormulas(controls[0], controls[1]);
</script>

<Canvas3D
  {formulas}
  cameraPosition={new Vector3(11.63, 3.66, 12.3)}
  bind:controls
  title="Two planes without a point in common."
>
  <AutoPlane values={[controls[0], controls[1]]} let:value let:planeSegment let:color>
    <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
  </AutoPlane>

  <Axis3D />
</Canvas3D>
