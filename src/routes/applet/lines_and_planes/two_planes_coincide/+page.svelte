<script lang="ts">
  import { AutoPlane, Axis3D, Canvas3D, PlaneFromNormal } from '$lib/threlte-components';
  import { Formulas } from '$lib/utils/Formulas';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const normal = new Vector3(1, 3, 1).normalize();
  let formulas: Formulas[] = [
    new Formulas('1x + 1y + 3z = \\$', 0, PrimeColor.red),
    new Formulas('1x + 1y + 3z = \\$', 0, PrimeColor.yellow)
  ];
</script>

<Canvas3D {formulas} showFormulasDefault title="Two planes with a point in common.">
  <AutoPlane values={[0, 0]} let:value let:planeSegment let:color>
    <PlaneFromNormal position={new Vector3(0, value, 0)} {normal} {planeSegment} {color} />
  </AutoPlane>

  <Axis3D />
</Canvas3D>
