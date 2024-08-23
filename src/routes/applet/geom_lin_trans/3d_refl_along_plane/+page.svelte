<script>
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';

  const controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen);
  const u = $derived(parametic_point_on_circle_3D(controls[0], 5));

  const u_refl = $derived(u.clone().multiply(new Vector3(1, -1, 1))); // Vector U_reflected
  const u_proj = $derived(u.clone().projectOnVector(u.clone().multiply(new Vector3(1, 0, 1)))); // Projection point of vector u on plane p
</script>

<Canvas3D {controls} title="Reflection of a vector along a plane">
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
    color={PrimeColor.raspberry}
    isDashed
  />

  <!-- Angle between proj and horizontal axis -->
  <Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
  <Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />
  <Latex3D latex={`Refl_p(\\mathbf{u})`} position={u_refl} color={PrimeColor.blue} />

  <Axis3D />
</Canvas3D>
