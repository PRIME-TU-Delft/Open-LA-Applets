<script lang="ts">
  import { Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    PlaneFromNormal,
    Point3D,
    Vector3D
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  const n = new Vector3(1, 3, 2);
  const _q = new Vector3(1, 1, -((n.x + n.y) / n.z));
  const q = _q.cross(n).normalize().multiplyScalar(n.length());
</script>

<Canvas3D
  cameraPosition={new Vector3(-10, 3.8, 13.6)}
  zoom={46}
  title="A plane through the origin."
>
  <PlaneFromNormal normal={n} color={PrimeColor.yellow} />

  <!-- Normal -->
  <Vector3D direction={n} color={PrimeColor.ultramarine} length={n.length()} />
  <Latex3D latex={'\\bold{n}'} position={n} />

  <!-- Q -->
  <Vector3D direction={q} color={PrimeColor.red} length={q.length()} />
  <Point3D position={q} color={PrimeColor.green} />
  <Latex3D latex={'Q'} position={q} />

  <Angle3D vs={[n, q]} />

  <Axis3D axisLength={7} />
</Canvas3D>
