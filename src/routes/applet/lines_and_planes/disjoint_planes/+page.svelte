<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/controls/Controls';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import { _ } from 'svelte-i18n';

  const n0 = new MathVector3(1, 1, 1).normalize();
  let controls = Controls.addSlider(0, -2, 0.5, 0.5, PrimeColor.darkGreen);

  const n1 = $derived(new MathVector3(1, controls[0], 1).normalize());
  // TODO: is this normal found correctly?

  const f1 = $derived(new Formula('P_1 = 1x + 1y + \\$z = 0', controls[0], PrimeColor.darkGreen));
  const f2 = $derived(new Formula('P_2 = 1x + 1y + \\$z = 0', 1, PrimeColor.yellow));
  const f3 = $derived(new Formula('P_3 = 1x + 1y + \\$z = 0', 0, PrimeColor.raspberry));
</script>

<Canvas3D
  cameraPosition={new MathVector3(7.89, 11.77, 9.96)}
  {controls}
  title={$_('applets.lines_and_planes.disjoint_planes.title')}
  formulas={[f1, f2, f3]}
>
  <PlaneFromNormal position={new MathVector3(0, 0, 1)} normal={n0} color={PrimeColor.yellow} />
  <PlaneFromNormal position={new MathVector3(0, 0, 0)} normal={n0} color={PrimeColor.raspberry} />

  <PlaneFromNormal position={new MathVector3(0, 0, 0)} normal={n1} color={PrimeColor.darkGreen} />

  <Axis3D />
</Canvas3D>
