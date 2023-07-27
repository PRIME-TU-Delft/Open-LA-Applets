<script lang="ts">
  import { Vector3 } from 'three';

  import { Canvas3D, Axis3D, PlaneFromNormal } from '$lib/threlte-components';
  import LatexUI from '$lib/components/Latex.svelte';

  import { PrimeColor } from 'utils/PrimeColors';
  import { Sliders, Slider } from 'utils/Slider';

  const n0 = new Vector3(1, 1, 1).normalize();
  let sliders = new Sliders().add(new Slider(0, -2, 2, 0.5, PrimeColor.green));

  $: n1 = new Vector3(sliders.x, 1, 1).normalize();
</script>

<Canvas3D
  cameraPosition={new Vector3(11.77, 9.96, 7.89)}
  bind:sliders
  title="Three planes without a point in common."
>
  <PlaneFromNormal position={new Vector3(0, 1, 0)} normal={n0} color={PrimeColor.yellow} />
  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n0} color={PrimeColor.red} />

  <PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n1} color={PrimeColor.green} />

  <Axis3D />

  <div slot="formulas">
    <LatexUI params={[sliders.x]} colors={[PrimeColor.green]} latex={`P_1 = 1x + 3y + \\$0z = 0`} />
    <LatexUI params={[1]} colors={[PrimeColor.yellow]} latex={`P_2 = 1x + 1y + \\$0z = 0`} />
    <LatexUI params={[0]} colors={[PrimeColor.red]} latex={`P_3 = 1x + 1y + \\$0z = 0`} />
  </div>
</Canvas3D>
