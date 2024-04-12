<script>
  import { Vector3 } from 'three';
  import {
    Angle3D,
    Axis3D,
    Canvas3D,
    Latex3D,
    Vector3D,
    PlaneFromNormal,
    Point3D
  } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Controls } from '$lib/utils/Controls';
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';
  import EllipseTrajectory from '../EllipseTrajectory.svelte';

  const ellipse_radius = 5;

  let controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen);
  $: u = parametic_point_on_circle_3D(controls[0], ellipse_radius);

  $: u_refl = u.clone().multiply(new Vector3(1, -1, 1)); // Vector U_reflected
  $: u_proj = u.clone().projectOnVector(u.clone().multiply(new Vector3(1, 0, 1))); // Projection point of vector u on plane p
</script>

<Canvas3D bind:controls>
  <EllipseTrajectory {ellipse_radius} reverse_in_red />

  <!-- vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={`\\mathbf{u}`} position={u} color={PrimeColor.darkGreen} />

  <!-- Plane p -->
  <PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.yellow} />

  <!-- Reflection v -->
  <Vector3D direction={u_refl} length={u_refl.length()} color={PrimeColor.blue} />
  <Vector3D
    origin={u}
    direction={u_refl.clone().sub(u)}
    length={u_refl.clone().sub(u).length()}
    color={PrimeColor.black}
    striped
    hideHead
  />

  <!-- Angle between proj and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />

  <!--Point of relection-->
  <Latex3D
    latex={`refl_\\mathcal{P}(\\mathbf{u})`}
    position={u_refl}
    color={PrimeColor.raspberry}
    offset={0.7}
  />
  <Point3D position={u_refl} color={PrimeColor.raspberry} />

  <Axis3D />
</Canvas3D>
