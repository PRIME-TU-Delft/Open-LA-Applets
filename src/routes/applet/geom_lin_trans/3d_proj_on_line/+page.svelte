<script lang="ts">
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
  import { Controls } from '$lib/utils/Controls';

  let controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15)

  function getPoint(t : number){
    //a, b -> plane of circle, need to be perpendicular
    //c -> center of circle
    const a = new Vector3(1, 0, 1).normalize();
    const b = new Vector3(1, 1, 0).normalize()
    const c = new Vector3(1, 1, 1);
    const radius = 7;
    let x = c.x + radius*Math.cos(t)*a.x + radius*Math.sin(t)*b.x;
    let y = c.y + radius*Math.cos(t)*a.y + radius*Math.sin(t)*b.y;
    let z = c.z + radius*Math.cos(t)*a.z + radius*Math.sin(t)*b.z;
    return new Vector3(x, y, z);
  }

  const a = new Vector3(-1, 0, 1).normalize();
    const b = new Vector3(-1, 1, 0).normalize()
    const c = new Vector3(1, 1, 1);
    const radius = 7;

  $: u = getPoint(controls[0]);

  $: lineL = new Vector3(3, 2, -1); // Line L
  $: lineDir = lineL.clone().normalize().multiplyScalar(10); // Line L scaled

  $: u_proj = u.clone().projectOnVector(lineL.clone());
</script>

<Canvas3D bind:controls>

  <Vector3D direction={a} length={a.length()} color={PrimeColor.orange} origin={c}/>
  <Vector3D direction={b} length={b.length()} color={PrimeColor.orange} origin={c}/>
  <Point3D position={c} color={PrimeColor.orange}/>
  <Latex3D latex={controls[0].toLocaleString()} position={c}/>
  <!-- Vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.darkGreen} />

  <!-- Projection vector from line L to u with a point at projection point -->
  <Point3D position={u_proj} color={PrimeColor.raspberry} />
  <Vector3D
    origin={u}
    direction={u.clone().sub(u_proj).multiplyScalar(-1)}
    length={u.clone().sub(u_proj).length()}
    color={PrimeColor.raspberry}
    striped
  />
  <Latex3D
    latex={'proj_L(\\mathbf{u})'}
    position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
    color={PrimeColor.raspberry}
  />

  <!-- Angle between proj and line l -->
  <Angle3D origin={u_proj} vs={[lineL, u.clone().sub(u_proj)]} />

  <Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathcal{L}'} position={lineDir} color={PrimeColor.blue} />

  <Axis3D />
</Canvas3D>
