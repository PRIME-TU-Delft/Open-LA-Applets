<script>
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
	import { Vector3 } from 'three';

	// const u = new Vector3(3, 4, 2); // Vector U - detached from the plane
	const controls = Controls.addSlider(-4.2, -Math.PI, Math.PI, 0.15, PrimeColor.darkGreen);

	const u = $derived(parametic_point_on_circle_3D(controls[0], 5));
	const v = $derived(u.clone().multiply(new Vector3(1, 0, 1))); // direction of projection on plane

	const u_proj = $derived(u.clone().projectOnVector(v)); // Projection point of vector u on plane p
</script>

<Canvas3D {controls}>
	<!-- vector U -->
	<Vector3D direction={u} length={u.length()} color={PrimeColor.darkGreen} />
	<Latex3D latex={`\\mathbf{u}`} position={u} color={PrimeColor.darkGreen} />

	<Vector3D direction={v} length={u_proj.length()} color={PrimeColor.blue} />

	<!-- Plane p -->
	<PlaneFromNormal normal={new Vector3(0, 1, 0)} color={PrimeColor.yellow} />

	<!-- Projection vector u and plane p -->
	<Point3D position={u_proj} color={PrimeColor.raspberry} />
	<Vector3D
		origin={u}
		direction={u_proj.clone().sub(u)}
		length={u_proj.clone().sub(u).length()}
		color={PrimeColor.raspberry}
		isDashed
	/>

	<!-- Angle between projection and horizontal axis -->
	<Angle3D origin={u_proj} vs={[new Vector3(1, 0, 0), u.clone().sub(u_proj)]} size={0.5} />
	<Angle3D origin={u_proj} vs={[new Vector3(0, 0, 1), u.clone().sub(u_proj)]} size={0.5} />
	<Latex3D
		latex={'Proj_p(\\mathbf{u})'}
		position={u_proj.clone().add(new Vector3(0, -0.5, 0))}
		color={PrimeColor.raspberry}
	/>

	<Axis3D />
</Canvas3D>
