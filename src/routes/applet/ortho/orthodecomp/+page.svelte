<script lang="ts">
	import { Vector3 } from 'three';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import Canvas3D from '$lib/threlte/Canvas3D.svelte';
	import Vector3D from '$lib/threlte/Vector3D.svelte';
	import Latex3D from '$lib/threlte/Latex3D.svelte';
	import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';

	let V = new Vector3(0, 0, 0);
	const n0 = new Vector3(0, 1, 0);

	let w = new Vector3(0, 4, 0);

	let proj_v = new Vector3(3, 0, 1.5);

	let v = new Vector3(3, 4, 1.5);
</script>

<Canvas3D cameraPosition={new Vector3(10, 10, 17)} cameraZoom={50}>
	<!-- v -->
	<Vector3D direction={v} length={v.length()} color={PrimeColor.blue} />
	<Latex3D
		latex={'\\mathbf{u}'}
		position={v.clone().add(new Vector3(0, 0.2, 0))}
		color={PrimeColor.blue}
	/>

	<!-- w -->
	<Vector3D direction={w} length={w.length()} color={PrimeColor.yellow} />
	<Latex3D latex={'\\mathbf{u}_{V^{\\bot}}'} position={w} color={PrimeColor.yellow} />

	<!-- proj_v -->
	<Vector3D direction={proj_v} length={proj_v.length()} color={PrimeColor.raspberry} />
	<Latex3D
		latex={'\\mathbf{u}_{V}'}
		position={proj_v.clone().add(new Vector3(0.2, 0, 0.2))}
		color={PrimeColor.raspberry}
	/>

	<!-- Dotted lines v and ProjV(v) -->
	<Vector3D
		origin={v}
		direction={proj_v.clone().sub(v)}
		length={proj_v.clone().sub(v).length()}
		color={PrimeColor.black}
		isDashed
		hideHead
	/>

	<!-- Dotted lines v and w -->
	<Vector3D
		origin={v}
		direction={w.clone().sub(v)}
		length={w.clone().sub(v).length()}
		color={PrimeColor.black}
		isDashed
		hideHead
	/>

	<!-- V -->
	<PlaneFromNormal position={V} normal={n0} color={PrimeColor.darkGreen} />
	<Latex3D latex={'V'} position={new Vector3(5.3, 0, 5.4)} color={PrimeColor.darkGreen} />
</Canvas3D>
