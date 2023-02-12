<script lang="ts">
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Parallellepipedum3D, Vector3D } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';

  const p1 = new Vector3(0, 0, 1);
  const p2 = new Vector3(1, 0, 0);
  const p3 = new Vector3(1, 2, 1);

  p1.setLength(3);
  p2.setLength(3);
  p3.setLength(3);
</script>

<Canvas3D>
  <Vector3D direction={p1} length={3} color={PrimeColor.red} />
  <Vector3D direction={p2} length={3} color={PrimeColor.yellow} />
  <Vector3D direction={p3} length={3} color={PrimeColor.green} />

  <Parallellepipedum3D points={[p1, p2, p3]} color={PrimeColor.red} />

  <Axis3D />
</Canvas3D>
