<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  const controls = Controls.addSlider(0, -10, 0, 0.5).addSlider(1, 1, 10, 0.5);

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\$x + 1y + 1z = 0', controls[0], PrimeColor.raspberry);
    const f2 = new Formula('\\$x + 1y + 1z = 0', controls[1], PrimeColor.yellow);

    return [f1, f2];
  });
</script>

<Canvas3D
  {controls}
  {formulas}
  title={$_('applets.lines_and_planes.plane_line_intersection.title')}
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal normal={new MathVector3(1, value, 1)} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

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
  {/if}

  <Axis3D />
</Canvas3D>
