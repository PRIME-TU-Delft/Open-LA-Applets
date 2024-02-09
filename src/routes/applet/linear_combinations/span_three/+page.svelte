<script>
  import { Axis3D, Canvas3D, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { Vector3 } from 'three';

  const v = new Vector3(3, 2, -3); // Direction of vector v
  const u = new Vector3(1, 3, 3); // Direction of vector u
  const w = new Vector3(1, -2, 0); // Direction of vector w

  const size = 15;
</script>

<Canvas3D>
  <Vector3D direction={u} length={u.length()} color={PrimeColor.red} />
  <Vector3D direction={v} length={v.length()} color={PrimeColor.blue} />
  <Vector3D direction={w} length={w.length()} color={PrimeColor.darkGreen} />

  <T.Mesh>
    <T.BoxGeometry args={[size, size, size]} />
    <T.MeshBasicMaterial transparent opacity={0.5} color={PrimeColor.yellow} />
  </T.Mesh>

  <Axis3D />
</Canvas3D>
