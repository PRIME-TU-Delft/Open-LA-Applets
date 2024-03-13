<script>
  import { Vector3 } from 'three';
  import { Axis3D, Canvas3D, Latex3D, PlaneFromPoints, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const u = new Vector3(1, 2, -2); // Vector U;
  const v = new Vector3(3, 1, 0); // Vector V;
  const w = u.clone().add(v); // Vector W = U + V;
</script>

<Canvas3D>
  <!-- Vector u -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.raspberry} />

  <!-- Vector v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.raspberry} />
  <Latex3D latex={'\\mathbf{v}'} position={v} color={PrimeColor.raspberry} />

  <!-- Vector w -->
  <Vector3D direction={w} length={w.length()} color={PrimeColor.orange} />
  <Latex3D latex={'\\mathbf{w}'} position={w} color={PrimeColor.orange} />

  <!-- helper striped Vectors -->
  <Vector3D
    origin={v}
    direction={u}
    length={u.length()}
    striped
    hideHead
    color={PrimeColor.black}
  />
  <Vector3D
    origin={u}
    direction={v}
    length={v.length()}
    striped
    hideHead
    color={PrimeColor.black}
  />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.yellow} size={15} />
  <Latex3D
    latex={'\\mathrm{Span}\\{\\mathbf{u},\\mathbf{v},\\mathbf{w}\\}'}
    position={w.clone().normalize().multiplyScalar(8)}
    offset={1.5}
  />

  <Axis3D />
</Canvas3D>
