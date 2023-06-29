<script>
	import { Vector3 } from 'three';
	import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
	import { PrimeColor } from 'utils/PrimeColors';

	$: v = new Vector3(3, 2, -3).normalize().multiplyScalar(3); // Vector v;
	$: u = v.clone().multiplyScalar(2); // Vector u = 2 * v;
	$: lineDir = v.clone().normalize().multiplyScalar(10);
</script>

<Canvas3D>
	<Vector3D direction={v} length={v.length()} striped radius={0.08} color={PrimeColor.red} />
	<Latex3D latex={'\\vec{v}'} position={v} />

	<Vector3D direction={u} length={u.length()} color={PrimeColor.yellow} />
	<Latex3D latex={'\\vec{u}'} position={u} />

	<Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
	<Latex3D latex={'Span\\{\\vec{v}\\}'} position={lineDir} />
	<Axis3D />
</Canvas3D>
