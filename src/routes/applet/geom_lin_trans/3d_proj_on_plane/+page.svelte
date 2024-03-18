<script>
  import { Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    Point3D,
    Vector3D,
    PlaneFromNormal
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { bVector } from '$lib/utils/LatexFormat';

  const u = new Vector3(3, 4, 2); // Vector U - detached from the plane
  const v = u.clone().multiply(new Vector3(1, 0, 1)); // direction of projection on plane

  const u_proj = u.clone().projectOnVector(v); // Projection point of vector u on plane p
</script>

<Canvas3D>
  <!-- vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={`\\mathbf{u} = ${bVector(u)}`} position={u} color={PrimeColor.darkGreen} />

  <Vector3D direction={v} length={u_proj.length()} color={PrimeColor.blue} />

  <!-- Plane p -->
  <PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.yellow} />

  <!-- Projection vector u and plane p -->
  <Point3D position={u_proj} color={PrimeColor.raspberry} />
  <Vector3D
    origin={u}
    direction={u_proj.clone().sub(u)}
    length={u_proj.clone().sub(u).length()}
    color={PrimeColor.raspberry}
    striped
  />

  <!-- Angle between projection and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />
  <Latex3D
    latex={'Proj_p(\\mathbf{u})'}
    position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
    color={PrimeColor.raspberry}
  />

  <Axis3D />
</Canvas3D>
