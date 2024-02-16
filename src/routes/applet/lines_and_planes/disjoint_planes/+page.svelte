<script lang="ts">
  import { Vector3 } from 'three';

  import { Axis3D, Canvas3D, PlaneFromNormal } from '$lib/threlte-components';

  import { Controls } from '$lib/utils/Controls';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const n0 = new Vector3(1, 1, 1).normalize();
  let controls = Controls.addSlider(0, -2, 0.5, 0.5, PrimeColor.darkGreen);

  $: n1 = new Vector3(controls[0], 1, 1).normalize();

  $: f1 = new Formula('P_1 = 1x + 1y + \\$z = 0', controls[0], PrimeColor.darkGreen);
  $: f2 = new Formula('P_2 = 1x + 1y + \\$z = 0', 1, PrimeColor.yellow);
  $: f3 = new Formula('P_3 = 1x + 1y + \\$z = 0', 0, PrimeColor.red);
</script>

<Canvas3D
  cameraPosition={new Vector3(11.77, 9.96, 7.89)}
  bind:controls
  title="Three planes without a point in common."
  formulas={[f1, f2, f3]}
>
  <PlaneFromNormal position={new Vector3(0, 1, 0)} normal={n0} color={PrimeColor.yellow} />
  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n0} color={PrimeColor.red} />

  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n1} color={PrimeColor.darkGreen} />

  <Axis3D />
</Canvas3D>
