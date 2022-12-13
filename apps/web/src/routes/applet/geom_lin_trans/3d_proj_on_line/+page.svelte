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
  } from 'threlte-components';
  import { PrimeColor } from 'utils/PrimeColors';

  const u = new Vector3(3, 4, -3); // Vector U - detached from the line

  $: lineL = new Vector3(3, 2, -1); // Line L
  $: lineDir = lineL.clone().normalize().multiplyScalar(10); // Line L scaled

  $: u_proj = u.clone().projectOnVector(lineL.clone());
</script>

<Canvas3D>
  <!-- Vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.green} />
  <Latex3D latex={'\\vec{u}'} position={u} />

  <!-- Projection vector from line L to u with a point at projection point -->
  <Point3D position={u_proj} color={PrimeColor.red} />
  <Vector3D
    origin={u_proj}
    direction={u.clone().sub(u_proj)}
    length={u.clone().sub(u_proj).length()}
    color={PrimeColor.red}
    striped
  />
  <Latex3D latex={'proj_L(\\vec{u})'} position={u_proj.clone().add(new Vector3(0, -0.5, 0))} />

  <!-- Angle between proj and line l -->
  <Angle3D origin={u_proj} vs={[lineL, u.clone().sub(u_proj)]} />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
  <Latex3D latex={'Line(L)'} position={lineDir} offset={-2} />

  <Axis3D />
</Canvas3D>
