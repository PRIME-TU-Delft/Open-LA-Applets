<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { withSign } from '$lib/utils/FormatString';

  let controls = Controls.addSlider(0.5, -1, 1, 0.1).addSlider(1, -1, 1, 0.1);

  const formulas = $derived.by(() => {
    const c0 = controls[0];
    const c1 = controls[1];

    const f0 = new Formula('\\$1: 1x + 0.5y - 1z = 0').addAutoParam('P_1', PrimeColor.darkGreen);
    const f1 = new Formula('\\$1: 1 x \\$2 y + 1z = 0')
      .addAutoParam('P_2', PrimeColor.raspberry)
      .addAutoParam(withSign(c0), PrimeColor.raspberry);
    const f2 = new Formula('\\$1: 1 x \\$2 y + 1z = 0')
      .addAutoParam('P_3', PrimeColor.yellow)
      .addAutoParam(withSign(c1), PrimeColor.yellow);

    return [f0, f1, f2];
  });
</script>

<Canvas3D
  cameraPosition={new MathVector3(5.35, 16.14, 3.31)}
  {formulas}
  cameraZoom={41}
  {controls}
  title={$_('applets.lines_and_planes.planes_point_intersection.title')}
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal normal={new MathVector3(1, value, 1)} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <!-- Plane x Rotated by 90 deg -->
  <PlaneFromNormal normal={new MathVector3(1, 0.5, -1)} color={PrimeColor.darkGreen} />

  {#if !controls.allSlidersEqualValue}
    <Vector3D
      color={PrimeColor.blue}
      length={11.5}
      origin={new MathVector3(4, 0, -4)}
      direction={new MathVector3(-1, 0, 1)}
      radius={1.5}
      alwaysOnTop
      hideHead
    />

    <Point3D position={new MathVector3(0, 0, 0)} color={PrimeColor.blue} />
  {/if}

  <Axis3D axisLength={7} />
</Canvas3D>
