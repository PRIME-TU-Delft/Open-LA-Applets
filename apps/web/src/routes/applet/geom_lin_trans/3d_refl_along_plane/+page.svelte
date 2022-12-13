<script>
  import { Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    Vector3D,
    PlaneFromNormal
  } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';
  import { bVector } from 'utils/LatexFormat';

  const u = new Vector3(3, 4, 2); // Vector U - detached from the plane
  const u_refl = u.clone().multiply(new Vector3(1, -1, 1)); // Vector U_reflected

  const u_proj = u.clone().projectOnVector(u.clone().multiply(new Vector3(1, 0, 1))); // Projection point of vector u on plane p
</script>

<Canvas3D>
  <!-- vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.green} />
  <Latex3D latex={`\\vec{u} = ${bVector(u)}`} position={u} />

  <!-- Plane p -->
  <PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.yellow} />

  <!-- Reflection v -->
  <Vector3D direction={u_refl} length={u_refl.length()} color={PrimeColor.ultramarine} />
  <Vector3D
    origin={u}
    direction={u_refl.clone().sub(u)}
    length={u_refl.clone().sub(u).length()}
    color={PrimeColor.red}
    striped
  />

  <!-- Angle between proj and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />
  <Latex3D latex={`Refl_p(\\vec{u}) = ${bVector(u_refl)}`} position={u_refl} />

  <Axis3D />
</Canvas3D>
