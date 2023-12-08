<script>
  import { Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    Line3D,
    Point3D,
    Vector3D
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';

  const u = new Vector3(3, 4, -3); // Vector U - detached from the line

  $: lineL = new Vector3(3, 2, -1); // Line L
  $: lineDir = lineL.clone().normalize().multiplyScalar(10); // Line L scaled

  $: u_proj = u.clone().projectOnVector(lineL.clone());
</script>

<Canvas3D>
  <!-- Vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.green} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.green} />

  <!-- Projection vector from line L to u with a point at projection point -->
  <Point3D position={u_proj} color={PrimeColor.red} />
  <Vector3D
    origin={u}
    direction={u.clone().sub(u_proj).multiplyScalar(-1)}
    length={u.clone().sub(u_proj).length()}
    color={PrimeColor.red}
    striped
  />
  <Latex3D
    latex={'proj_L(\\mathbf{u})'}
    position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
    color={PrimeColor.red}
  />

  <!-- Angle between proj and line l -->
  <Angle3D origin={u_proj} vs={[lineL, u.clone().sub(u_proj)]} />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathcal{L}'} position={lineDir} color={PrimeColor.blue} />

  <Axis3D />
</Canvas3D>
