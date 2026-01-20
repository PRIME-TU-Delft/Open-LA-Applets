<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import { _ } from 'svelte-i18n';

  const normal = new Vector3(-0.5, 3, 1).normalize();
  const controls = Controls.addSlider(3, 1, 5, 0.5).addSlider(0, -5, 0, 0.5);

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      `1x + 1y + 3z = \\$`,
      controls[0],
      PrimeColor.raspberry
    );
    const f2 = new Formula(
      `1x + 1y + 3z = \\$`,
      controls[1],
      PrimeColor.yellow
    );

    return [f1, f2];
  });
</script>

<Canvas3D
  {formulas}
  cameraPosition={new Vector3(11.63, 3.66, 12.3)}
  {controls}
  title={$_('applets.lines_and_planes.two_disjoint_planes.title')}
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <Axis3D />
</Canvas3D>
