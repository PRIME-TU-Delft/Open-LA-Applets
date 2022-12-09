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
  } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';

  const n = new Vector3(1, 2, 1);
  const q = new Vector3(1, 1, -((n.x + n.y) / n.z));
</script>

<!-- TODO: cameraPos={[1, 0.5, 2]} -->
<Canvas3D title="A plane through the origin." isPerspectiveCamera={false}>
  <PlaneFromNormal normal={n} color={PrimeColor.yellow} />

  <!-- Normal -->
  <Vector3D direction={n} color={PrimeColor.ultramarine} length={n.length()} />
  <Latex3D latex={'\\vec{n}'} position={n} />

  <!-- Q -->
  <Vector3D direction={q} color={PrimeColor.red} length={q.length()} />
  <Point3D position={q} color={PrimeColor.green} />
  <Latex3D latex={'Q'} position={q} />

  <Angle3D vs={[n, q]} />

  <Axis3D showNumbers />
</Canvas3D>
