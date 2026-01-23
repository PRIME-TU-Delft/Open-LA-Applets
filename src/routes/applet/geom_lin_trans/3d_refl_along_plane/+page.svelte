<script lang="ts">
  import { MathVector3 } from '$lib/utils/MathVector';
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import EllipseTrajectory from '../EllipseTrajectory.svelte';

  const ellipse_radius = 5;

  let controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen, {
    loop: true
  });

  const u = $derived(parametic_point_on_circle_3D(controls[0], ellipse_radius));

  const u_refl = $derived(u.clone().multiply(new MathVector3(1, 1, -1))); // Vector U_reflected
  const u_proj = $derived(u.clone().projectOnVector(u.clone().multiply(new MathVector3(1, 1, 0)))); // Projection point of vector u on plane p
</script>

<Canvas3D {controls}>
  <EllipseTrajectory r={ellipse_radius} reverse_in_red />

  <!-- vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={`\\mathbf{u}`} position={u} color={PrimeColor.darkGreen} />

  <!-- Plane p -->
  <PlaneFromNormal normal={new MathVector3(0, 0, 1)} color={PrimeColor.yellow} opacity={0.5} />
  <Latex3D
    latex={`\\mathcal{P}`}
    position={new MathVector3(-5.5, 1, 0)}
    color={PrimeColor.yellow}
  />

  <!-- Reflection v -->
  <Vector3D direction={u_refl} length={u_refl.length()} color={PrimeColor.blue} />
  <Vector3D
    origin={u}
    direction={u_refl.clone().sub(u)}
    length={u_refl.clone().sub(u).length()}
    color={PrimeColor.black}
    hideHead
    isDashed
  />

  <!-- Angle between proj and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new MathVector3(0, 1, 0), new MathVector3(0, 0, 1)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new MathVector3(1, 0, 0), new MathVector3(0, 0, 1)]} size={0.5} />

  <!--Point of relection-->
  <Latex3D
    latex={`\\mathrm{refl}_\\mathcal{P}(\\mathbf{u})`}
    position={u_refl}
    color={PrimeColor.raspberry}
    extend={0.7}
  />
  <Point3D position={u_refl} color={PrimeColor.raspberry} />

  <Axis3D />
</Canvas3D>
