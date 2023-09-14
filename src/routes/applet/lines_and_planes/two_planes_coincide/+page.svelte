<script lang="ts">
  import LatexUI from '$lib/components/Latex.svelte';
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const normal = new Vector3(1, 3, 1).normalize();
</script>

<Canvas3D title="Two planes with a point in common.">
  <AutoPlane values={[0, 0]} let:value let:planeSegment let:color>
    <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
  </AutoPlane>

  <Axis3D />

  <div slot="formulas">
    <LatexUI params={[0]} colors={[PrimeColor.red]} latex={`1x + 1y + 3z = \\$0`} />

    <LatexUI params={[0]} colors={[PrimeColor.yellow]} latex={`1x + 1y + 3z = \\$0`} />
  </div>
</Canvas3D>
