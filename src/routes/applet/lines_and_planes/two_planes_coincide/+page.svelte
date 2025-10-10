<script lang="ts">
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import AutoPlanes from '$lib/threlte/planes/AutoPlanes.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import { Formula } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import { _ } from 'svelte-i18n';

  const normal = new Vector3(1, 3, 1).normalize();
  let formulas: Formula[] = [
    new Formula('1x + 1y + 3z = \\$', 0, PrimeColor.raspberry),
    new Formula('1x + 1y + 3z = \\$', 0, PrimeColor.yellow)
  ];
</script>

<Canvas3D
  {formulas}
  showFormulasDefault
  title={$_('applets.lines_and_planes.two_planes_coincide.title')}
>
  <AutoPlanes values={[0, 0]}>
    {#snippet children(value, _, planeSegment, color)}
      <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
    {/snippet}
  </AutoPlanes>

  <Axis3D />
</Canvas3D>
