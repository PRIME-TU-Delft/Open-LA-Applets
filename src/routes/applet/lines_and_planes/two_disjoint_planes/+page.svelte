<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const normal = new Vector3(1, 3, 1).normalize();
  const controls = Controls.addSlider(1, 1, 5, 0.5).addSlider(0, -5, 0, 0.5);

  const formulas = $derived.by(() => {
    const f1 = new Formula(
      `1x + 1y + (3 ${controls[0] < 0 ? '' : '+'}\\$)z = 0`,
      controls[0],
      PrimeColor.raspberry
    );
    const f2 = new Formula(
      `1x + 1y + (3 ${controls[1] < 0 ? '' : '+'}\\$)z = 0`,
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
  title={{
    en: 'Two planes without a point in common.',
    nl: 'Twee vlakken zonder een gemeenschappelijk punt.'
  }}
>
  <AutoPlanes values={[controls[0], controls[1]]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <Axis3D />
</Canvas3D>
