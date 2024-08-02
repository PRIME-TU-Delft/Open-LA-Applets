<script lang="ts">
	import Axis3D from '$lib/threlte/Axis3D.svelte';
	import Latex3D from '$lib/threlte/Latex3D.svelte';
	import Parallelepiped3D from '$lib/threlte/Parallelepiped3D.svelte';
	import Point3D from '$lib/threlte/Point3D.svelte';
	import Vector3D from '$lib/threlte/Vector3D.svelte';
	import { MathVector3 } from '$lib/utils/MathVector';
	import { PrimeColor } from '$lib/utils/PrimeColors';
	import { Vector2, Vector3 } from 'three';

	let {
		u,
		v
	}: {
		u: Vector2;
		v: Vector2;
	} = $props();

	const tu = $derived(new MathVector3(u.x, u.y, 0));
	const tv = $derived(new MathVector3(v.x, v.y, 0));
	const uxv = $derived(tu.clone().cross(tv));

	const C = $derived(tu.clone().add(tv)); // C = u + v
</script>

<Axis3D />

<Parallelepiped3D
	points={[new Vector3(0, 0), tu, tv]}
	color={PrimeColor.yellow}
	strokeWidth={0.5}
/>

<Vector3D direction={tu} length={tu.length()} color={PrimeColor.raspberry}>
	{#snippet children(endPoint)}
		<Latex3D latex={'\\tilde{\\mathbf{u}}'} position={endPoint?.clone().multiplyScalar(0.5)} />
		<Latex3D latex={'A'} extend={0.2} position={endPoint} />
		<Point3D position={endPoint || new Vector3()} color={PrimeColor.raspberry} />
	{/snippet}
</Vector3D>

<Vector3D direction={tv} length={tv.length()} color={PrimeColor.darkGreen}>
	{#snippet children(endPoint)}
		<Latex3D latex={'\\tilde{\\mathbf{v}}'} position={endPoint?.clone().multiplyScalar(0.5)} />
		<Latex3D latex={'B'} extend={0.2} position={endPoint} />
		<Point3D position={endPoint || new Vector3()} color={PrimeColor.darkGreen} />
	{/snippet}
</Vector3D>

<Latex3D latex={'C'} extend={0.2} position={C} />

<Vector3D isDashed direction={uxv} length={uxv.length()} color={PrimeColor.blue}>
	{#snippet children(endPoint)}
		<Latex3D
			latex={'\\tilde{\\mathbf{u}} \\times \\tilde{\\mathbf{v}}'}
			extend={0.2}
			position={endPoint}
		/>
		<Point3D position={endPoint || new Vector3()} color={PrimeColor.blue} />
	{/snippet}
</Vector3D>

<!-- e1 & e2 & e3 -->
<Vector3D direction={new Vector3(0, 0, 1)} length={1} color={PrimeColor.blue}>
	{#snippet children(endPoint)}
		<Latex3D latex={'\\mathbf{e_1}'} extend={0.1} position={endPoint} />
	{/snippet}
</Vector3D>
<Vector3D direction={new Vector3(1, 0, 0)} length={1} color={PrimeColor.blue}>
	{#snippet children(endPoint)}
		<Latex3D latex={'\\mathbf{e_2}'} extend={0.1} position={endPoint} />
	{/snippet}
</Vector3D>
<Vector3D direction={new Vector3(0, 1, 0)} length={1} color={PrimeColor.blue}>
	{#snippet children(endPoint)}
		<Latex3D latex={'\\mathbf{e_3}'} extend={0.1} position={endPoint} />
	{/snippet}
</Vector3D>
