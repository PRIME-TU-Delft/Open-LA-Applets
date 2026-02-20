<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Formula, Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/controls/Controls';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import { _ } from 'svelte-i18n';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import { withSign } from '$lib/utils/FormatString';

  const n0 = new MathVector3(1, 1, 1).normalize();
  const controls = Controls.addSlider(0, -2, 0.5, 0.5, PrimeColor.darkGreen);

  const formulas = $derived.by(() => {
    const f1 = new Formula('\\$1 : x \\$2y + z &= 0')
      .addAutoParam('P_1', PrimeColor.darkGreen)
      .addAutoParam(withSign(controls[0], 1), PrimeColor.darkGreen);
    const f2 = new Formula('\\$1 : x + y + z &= 1').addAutoParam('P_2', PrimeColor.yellow);
    const f3 = new Formula('\\$1 : x + y + z &= 0').addAutoParam('P_3', PrimeColor.raspberry);

    return new Formulas(f1, f2, f3).align();
  });
</script>

<Canvas3D
  cameraPosition={new MathVector3(7.89, 11.77, 9.96)}
  {controls}
  title={$_('applets.lines_and_planes.disjoint_planes.title')}
  {formulas}
>
  <PlaneFromNormal position={new MathVector3(0, 0, 1)} normal={n0} color={PrimeColor.yellow} />
  <PlaneFromNormal position={new MathVector3(0, 0, 0)} normal={n0} color={PrimeColor.raspberry} />

  <AutoPlanes values={[controls[0]]}>
    {#snippet children(value, _, planeSegment, _color)}
      <PlaneFromNormal
        position={new MathVector3(0, 0, 0)}
        normal={new MathVector3(1, value, 1).normalize()}
        {planeSegment}
        color={PrimeColor.darkGreen}
      />
    {/snippet}
  </AutoPlanes>

  <Axis3D />
</Canvas3D>
