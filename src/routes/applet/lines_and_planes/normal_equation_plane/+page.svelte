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

  const normal = new Vector3(2, 4, 1);
  const normalizedNormal = normal.clone().normalize();
  const p = new Vector3(2, 1, 0.5);

  const _q = new Vector3(1, 1, -((normalizedNormal.x + normalizedNormal.y) / normalizedNormal.z));
  const q = _q.cross(normalizedNormal).normalize().multiplyScalar(normal.length());
</script>

<Canvas3D
  cameraPosition={new Vector3(-11, 5.4, 12.4)}
  cameraZoom={46}
  title="A plane through the point P."
>
  <PlaneFromNormal {normal} position={p} color={PrimeColor.yellow} />

  <!-- Normal -->
  <Vector3D origin={p} direction={normal} color={PrimeColor.blue} length={normal.length()} />
  <Latex3D
    latex={'\\mathbf{n}'}
    position={p.clone().add(normal.clone())}
    offset={0.2}
    color={PrimeColor.blue}
  />

  <!-- P -->
  <Point3D position={p} color={PrimeColor.pink} />
  <Latex3D latex={'P'} position={p} offset={-0.5} color={PrimeColor.pink} />

  <!-- Q -->
  <Point3D position={q.clone().add(p)} color={PrimeColor.darkGreen} />
  <Latex3D latex={'Q'} position={q.clone().add(p)} offset={0.6} color={PrimeColor.darkGreen} />
  <Vector3D origin={p} direction={q} color={PrimeColor.red} length={normal.length()} />

  <Angle3D vs={[normal, q]} origin={p} size={0.5} />

  <Axis3D axisLength={7} />
</Canvas3D>
