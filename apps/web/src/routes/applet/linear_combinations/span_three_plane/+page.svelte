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
  <Vector3D direction={u} length={u.length()} color={PrimeColor.red} />
  <Latex3D latex={'\\vec{u}'} position={u} />

  <!-- Vector v -->
  <Vector3D direction={v} length={v.length()} color={PrimeColor.red} />
  <Latex3D latex={'\\vec{v}'} position={v} />

  <!-- Vector w -->
  <Vector3D direction={w} length={w.length()} color={PrimeColor.green} />
  <Latex3D latex={'\\vec{w}'} position={w} />

  <!-- helper striped Vectors -->
  <Vector3D origin={v} direction={u} length={u.length()} striped color={PrimeColor.black} />
  <Vector3D origin={u} direction={v} length={v.length()} striped color={PrimeColor.black} />

  <!-- Plane span -->
  <PlaneFromPoints points={[new Vector3(0, 0, 0), u, v]} color={PrimeColor.ultramarine} size={15} />
  <Latex3D
    latex={'Span\\{\\vec{u},\\vec{v},\\vec{w}\\}'}
    position={w.clone().normalize().multiplyScalar(8)}
    offset={0}
  />

  <Axis3D />
</Canvas3D>
