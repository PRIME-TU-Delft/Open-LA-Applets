<script lang="ts">
	import Angle3D from '$lib/threlte/Angle3D.svelte';
	import Axis3D from '$lib/threlte/Axis3D.svelte';
	import Canvas3D from '$lib/threlte/Canvas3D.svelte';
	import Latex3D from '$lib/threlte/Latex3D.svelte';
	import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
	import Point3D from '$lib/threlte/Point3D.svelte';
	import Vector3D from '$lib/threlte/Vector3D.svelte';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Vector3 } from 'three';

	const normal = new Vector3(2, 4, 1);
	const normalizedNormal = normal.clone().normalize();
	const p = new Vector3(2, 1, 0.5);

	const _q = new Vector3(1, 1, -((normalizedNormal.x + normalizedNormal.y) / normalizedNormal.z));
	const q = _q.cross(normalizedNormal).normalize().multiplyScalar(normal.length());
</script>

<Canvas3D
	cameraPosition={new Vector3(-11, 5.4, 12.4)}
	cameraZoom={46}
	title="A plane through the point P."
>
	<PlaneFromNormal {normal} position={p} color={PrimeColor.yellow} />

	<!-- Normal -->
	<Vector3D origin={p} direction={normal} color={PrimeColor.orange} length={normal.length()} />
	<Latex3D
		latex={'\\mathbf{n}'}
		position={p.clone().add(normal.clone())}
		extend={0.3}
		color={PrimeColor.orange}
	/>

	<!-- P -->
	<Point3D position={p} color={PrimeColor.blue} />
	<Latex3D latex={'P'} position={p} extend={-0.5} color={PrimeColor.blue} />

	<!-- Q -->
	<Point3D position={q.clone().add(p)} color={PrimeColor.darkGreen} />
	<Latex3D latex={'Q'} position={q.clone().add(p)} extend={0.6} color={PrimeColor.darkGreen} />
	<Vector3D
		origin={p}
		direction={q}
		color={PrimeColor.raspberry}
		length={normal.length()}
		alwaysOnTop
	/>

	<Angle3D vs={[normal, q]} origin={p} size={0.5} />

	<Axis3D axisLength={7} />
</Canvas3D>
