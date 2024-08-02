<script lang="ts">
	import { Vector3 } from 'three';
	import { Formula } from '$lib/utils/Formulas';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Controls } from '$lib/controls/Controls';
	import Canvas3D from '$lib/threlte/Canvas3D.svelte';
	import PlaneFromNormal from '$lib/threlte/planes/PlaneFromNormal.svelte';
	import Axis3D from '$lib/threlte/Axis3D.svelte';

	const n0 = new Vector3(1, 1, 1).normalize();
	let controls = Controls.addSlider(0, -2, 0.5, 0.5, PrimeColor.darkGreen);

	const n1 = $derived(new Vector3(controls[0], 1, 1).normalize());

	const f1 = $derived(new Formula('P_1 = 1x + 1y + \\$z = 0', controls[0], PrimeColor.darkGreen));
	const f2 = $derived(new Formula('P_2 = 1x + 1y + \\$z = 0', 1, PrimeColor.yellow));
	const f3 = $derived(new Formula('P_3 = 1x + 1y + \\$z = 0', 0, PrimeColor.raspberry));
</script>

<Canvas3D
	cameraPosition={new Vector3(11.77, 9.96, 7.89)}
	{controls}
	title="Three planes without a point in common."
	formulas={[f1, f2, f3]}
>
	<PlaneFromNormal position={new Vector3(0, 1, 0)} normal={n0} color={PrimeColor.yellow} />
	<PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n0} color={PrimeColor.raspberry} />

	<PlaneFromNormal position={new Vector3(0, 0, 0)} normal={n1} color={PrimeColor.darkGreen} />

	<Axis3D />
</Canvas3D>
