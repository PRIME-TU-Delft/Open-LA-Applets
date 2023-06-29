<script>
	import { Vector3 } from 'three';
	import { Axis3D, Canvas3D, Latex3D, Line3D, Vector3D } from '$lib/threlte-components';
	import { PrimeColor } from 'utils/PrimeColors';

	$: vDir = new Vector3(3, 2, -3); // Direction of vector v
	$: lineDir = vDir.clone().normalize().multiplyScalar(10); // Line L (v scaled)
</script>

<Canvas3D>
	<Vector3D direction={vDir} length={vDir.length()} color={PrimeColor.red} />
	<Latex3D latex={'\\vec{v}'} position={vDir} />

	<Line3D points={[lineDir.clone().multiplyScalar(-1), lineDir]} color={PrimeColor.ultramarine} />
	<Latex3D latex={'Span\\{\\vec{v}\\}'} position={lineDir} />
	<Axis3D />
</Canvas3D>
