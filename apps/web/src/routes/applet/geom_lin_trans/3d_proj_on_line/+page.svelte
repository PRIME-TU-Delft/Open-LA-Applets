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

  const u = new Vector3(3, 4, 2);

  $: lineL = new Vector3(3, 2, -1);
  $: lineDir = lineL.clone().normalize().multiplyScalar(10);

  $: u_proj = u.clone().projectOnVector(lineL.clone());
</script>

<Canvas3D>
  <!-- Vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.green} />
  <Latex3D latex={'\\vec{u}'} position={u} />

  <!-- Projection -->
  <Point3D position={u_proj} color={PrimeColor.red} />
  <Vector3D
    origin={u_proj}
    direction={u.clone().sub(u_proj)}
    length={u.clone().sub(u_proj).length()}
    color={PrimeColor.red}
    striped
  />

  <!-- Angle between proj and line l -->
  <Angle3D origin={u_proj} vs={[lineL, u.clone().sub(u_proj)]} let:labelPosition>
    <Latex3D latex={'proj_L(\\vec{u})'} position={labelPosition} />
  </Angle3D>

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
  <Latex3D latex={'Line(L)'} position={lineDir} />

  <Axis3D />
</Canvas3D>
