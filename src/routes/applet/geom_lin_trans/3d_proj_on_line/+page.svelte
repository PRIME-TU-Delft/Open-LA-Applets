<script lang="ts">
  import { Controls } from '$lib/controls/Controls';
  import Angle3D from '$lib/threlte/Angle3D.svelte';
  import Axis3D from '$lib/threlte/Axis3D.svelte';
  import Canvas3D from '$lib/threlte/Canvas3D.svelte';
  import Latex3D from '$lib/threlte/Latex3D.svelte';
  import Line3D from '$lib/threlte/Line3D.svelte';
  import Point3D from '$lib/threlte/Point3D.svelte';
  import Vector3D from '$lib/threlte/Vector3D.svelte';
  import { parametic_point_on_circle_3D } from '$lib/utils/MathLib';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { Vector3 } from 'three';
  import EllipseTrajectory from '../EllipseTrajectory.svelte';
  import { _ } from 'svelte-i18n';

  const controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen, {
    loop: true
  });

  const u = $derived(parametic_point_on_circle_3D(controls[0], 5));

  const lineL = new Vector3(3, 2, -1); // Line L
  const lineDir = lineL.clone().normalize().multiplyScalar(10); // Line L scaled

  const u_proj = $derived(u.clone().projectOnVector(lineL.clone()));
</script>

<Canvas3D {controls} title={$_('applets.geom_lin_trans.proj_on_line_3d.title')}>
  <!-- Vector U -->
  <Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
  <Latex3D latex={'\\mathbf{u}'} position={u} color={PrimeColor.darkGreen} />

  <!-- Projection vector from line L to u with a point at projection point -->
  <Point3D position={u_proj} color={PrimeColor.raspberry} />
  <Vector3D
    origin={u}
    direction={u.clone().sub(u_proj).multiplyScalar(-1)}
    length={u.clone().sub(u_proj).length()}
    color={PrimeColor.black}
    isDashed
  />
  <Latex3D
    latex={'\\mathrm{proj}_{\\mathcal{L}}(\\mathbf{u})'}
    position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
    color={PrimeColor.raspberry}
  />

  <!-- Angle between proj and line l -->
  <Angle3D origin={u_proj} vs={[lineL, u.clone().sub(u_proj)]} />

  <Line3D origin={lineDir.clone().multiplyScalar(-1)} endPoint={lineDir} color={PrimeColor.blue} />
  <Latex3D latex={'\\mathcal{L}'} position={lineDir} color={PrimeColor.blue} />

  <!-- Helper Trajectory -->
  <EllipseTrajectory r={5} />

  <Axis3D />
</Canvas3D>
