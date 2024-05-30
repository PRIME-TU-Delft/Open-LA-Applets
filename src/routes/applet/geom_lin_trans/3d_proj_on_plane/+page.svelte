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
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';
  import { Controls } from '$lib/utils/Controls';
  import EllipseTrajectory from '../EllipseTrajectory.svelte';
  import Vector from '$lib/threlte-components/Vector.svelte';

  const ellipse_radius = 5;

  // const u = new Vector3(3, 4, 2); // Vector U - detached from the plane
  let controls = Controls.addSlider(
    -4.2,
    -Math.PI,
    Math.PI,
    0.15,
    PrimeColor.darkGreen,
    undefined,
    undefined,
    true
  );
  $: u = parametic_point_on_circle_3D(controls[0], ellipse_radius);

  $: v = u.clone().multiply(new Vector3(1, 0, 1)); // direction of projection on plane
  $: u_proj = u.clone().projectOnVector(v); // Projection point of vector u on plane p
</script>

<Canvas3D bind:controls>
  <EllipseTrajectory r={ellipse_radius} trajectory_on_plane />

  <!-- vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={`\\mathbf{u}`} position={u} color={PrimeColor.darkGreen} />

  <Vector3D direction={v} length={u_proj.length()} color={PrimeColor.blue} />

  <!-- Plane p -->
  <PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.yellow} />
  <Latex3D latex={`\\mathcal{P}`} position={new Vector3(1, 0, -5.5)} color={PrimeColor.yellow} />

  <!-- Projection vector u and plane p -->
  <Point3D position={u_proj} color={PrimeColor.raspberry} />
  <Vector3D
    origin={u}
    direction={u_proj.clone().sub(u)}
    length={u_proj.clone().sub(u).length()}
    color={PrimeColor.black}
    hideHead
    striped
  />

  <!-- Angle between projection and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />
  <Latex3D
    latex={'\\mathrm{proj}_\\mathcal{P}(\\mathbf{u})'}
    position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
    color={PrimeColor.raspberry}
  />

  <Axis3D />
</Canvas3D>
