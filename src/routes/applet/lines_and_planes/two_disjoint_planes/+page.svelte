<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { _ } from 'svelte-i18n';

  const normal = new MathVector3(-0.5, 1, 3).normalize();
  const controls = Controls.addSlider(3, 1, 5, 0.5).addSlider(0, -5, 0, 0.5);

  const formulas = $derived.by(() => {
    const f1 = new Formula(`-0.5 x + 1 y + 3z = \\$`, controls[0], PrimeColor.raspberry);
    const f2 = new Formula(`-0.5 x + 1 y + 3z = \\$`, controls[1], PrimeColor.yellow);

    return [f1, f2];
  });
</script>

<Canvas3D
  {formulas}
  cameraPosition={new MathVector3(12.3, 11.63, 3.66)}
  {controls}
  title={$_('applets.lines_and_planes.two_disjoint_planes.title')}
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal position={new MathVector3(0, 0, value)} {normal} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <Axis3D />
</Canvas3D>
