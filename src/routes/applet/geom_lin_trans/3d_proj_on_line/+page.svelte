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
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';

  const no_trajectory_points = 30; //how many trailing points on tracetory
  const trajectory = [...Array(no_trajectory_points)].map((_, i) => 0 + i *  (2*Math.PI/no_trajectory_points));

  


  let controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen);

  $: u = parametic_point_on_circle_3D(controls[0], 5);
  //$: trajectory = [controls[0]-1, controls[0]-2, controls[0]-3, controls[0]-4] //TODO replace with funcitonal
  
  $: lineL = new Vector3(3, 2, -1); // Line L
  $: lineDir = lineL.clone().normalize().multiplyScalar(10); // Line L scaled

  $: u_proj = u.clone().projectOnVector(lineL.clone());
</script>

<Canvas3D bind:controls>
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

  <!--Trail trajectory-->
  {#each trajectory as t}
    {#if t != 0 }
      
    {/if}
    <Point3D position={parametic_point_on_circle_3D(t, 5)} color ={PrimeColor.darkGreen}/>
    
  {/each}
</Canvas3D>
