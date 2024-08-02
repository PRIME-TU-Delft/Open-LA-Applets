<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  let controls = Controls.addSlider(0.5).addSlider(1);
  let formulas: Formula[] = [];

  function setFormulas(c0: number, c1: number) {
    const f0 = new Formula('P_1 = 0.5x + \\$y + 1z = 0', -1, PrimeColor.darkGreen);
    const f1 = new Formula('P_2 = \\$x + 1y + 1z = 0', c0, PrimeColor.raspberry);
    const f2 = new Formula('P_3 = \\$x + 1y + 1z = 0', c1, PrimeColor.yellow);

    return [f0, f1, f2];
  }

  $: formulas = setFormulas(controls[0], controls[1]);
</script>

<Canvas3D
  cameraPosition={new Vector3(16.14, 3.31, 5.35)}
  {formulas}
  cameraZoom={41}
  {controls}
  title="Two planes with a line of intersection."
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal normal={new Vector3(value, 1, 1)} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <!-- Plane x Rotated by 90 deg -->
  <PlaneFromNormal normal={new Vector3(0.5, -1, 1)} color={PrimeColor.darkGreen} />

  {#if !controls.allSlidersEqualValue}
    <Vector3D
      color={PrimeColor.blue}
      length={11.5}
      origin={new Vector3(0, -4, 4)}
      direction={new Vector3(0, 1, -1)}
      radius={1.5}
      alwaysOnTop
      hideHead
    />

    <Point3D position={new Vector3(0, 0, 0)} color={PrimeColor.blue} />
  {/if}

  <Axis3D axisLength={7} />
</Canvas3D>
