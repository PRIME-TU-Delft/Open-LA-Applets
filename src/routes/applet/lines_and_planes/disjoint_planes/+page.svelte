<script lang="ts">
  import { Vector3 } from 'three';

  import { Canvas3D, Axis3D, PlaneFromNormal } from '$lib/threlte-components';

  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Sliders, Slider } from '$lib/utils/Slider';
  import { Formula } from '$lib/utils/Formulas';

  const n0 = new Vector3(1, 1, 1).normalize();
  let sliders = new Sliders().add(new Slider(0, -2, 0.5, 0.5, PrimeColor.darkGreen));

  $: n1 = new Vector3(sliders.x, 1, 1).normalize();

  $: f1 =
    sliders.x != undefined
      ? new Formula('P_1 = 1x + 1y + \\$z = 0', sliders.x, PrimeColor.darkGreen)
      : new Formula('');
  $: f2 = new Formula('P_2 = 1x + 1y + \\$z = 0', 1, PrimeColor.yellow);
  $: f3 = new Formula('P_3 = 1x + 1y + \\$z = 0', 0, PrimeColor.red);
</script>

<Canvas3D
  cameraPosition={new Vector3(11.77, 9.96, 7.89)}
  bind:sliders
  title="Three planes without a point in common."
  formulas={[f1, f2, f3]}
>
  <PlaneFromNormal position={new Vector3(0, 1, 0)} normal={n0} color={PrimeColor.yellow} />
  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n0} color={PrimeColor.red} />

  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n1} color={PrimeColor.darkGreen} />

  <Axis3D />
</Canvas3D>
