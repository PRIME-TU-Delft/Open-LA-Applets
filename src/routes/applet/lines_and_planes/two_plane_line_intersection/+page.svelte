<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';
  import { withSign } from '$lib/utils/FormatString';

  const controls = Controls.addSlider(0, -10, 0, 0.5).addSlider(1, 1, 10, 0.5);

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\$2: x \\$1y + z &= 0')
      .addAutoParam(withSign(controls[0]), PrimeColor.raspberry)
      .addAutoParam('P_1', PrimeColor.raspberry);
    const f2 = new Formula('\\$2: x \\$1y + z &= 0')
      .addAutoParam(withSign(controls[1]), PrimeColor.yellow)
      .addAutoParam('P_2', PrimeColor.yellow);

    return new Formulas(f1, f2).align();
  });
</script>

<Canvas3D
  {controls}
  {formulas}
  title={$_('applets.lines_and_planes.two_plane_line_intersection.title')}
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
