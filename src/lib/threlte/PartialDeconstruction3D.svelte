<script lang="ts">
	import { Vector3 } from 'three';
	import Line3D from './Line3D.svelte';
	import Point3D from './Point3D.svelte';

	// export let p: Vector3;
	// export let color = 'black'; //color of used lines
	// export let showAxisPoints = false;
	// export let pointSize = 0.05;
	type PartialDeconstruction3DProps = {
		p: Vector3;
		color?: string;
		showAxisPoints?: boolean;
		pointSize?: number;
	};

	let {
		p,
		color = 'black',
		showAxisPoints = false,
		pointSize = 0.05
	}: PartialDeconstruction3DProps = $props();

	//points on each axis
	let xAx = $derived(new Vector3(p.x, 0, 0));
	let yAx = $derived(new Vector3(0, p.y, 0));
	let zAx = $derived(new Vector3(0, 0, p.z));

	//points on each plane
	let yP = $derived(new Vector3(p.x, 0, p.z));
</script>

<!-- three lines to x,z axis -->
<Line3D origin={p} endPoint={yP} {color} isDashed />
<Line3D origin={yP} endPoint={xAx} {color} isDashed />
<Line3D origin={yP} endPoint={zAx} {color} isDashed />

<!-- line to z axis -->
<Line3D origin={p} endPoint={yAx} {color} isDashed />

<!-- points on axis -->
{#if showAxisPoints}
	<Point3D position={xAx} {color} size={pointSize} />
	<Point3D position={yAx} {color} size={pointSize} />
	<Point3D position={zAx} {color} size={pointSize} />
{/if}
