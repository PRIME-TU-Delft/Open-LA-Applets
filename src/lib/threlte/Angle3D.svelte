<script lang="ts">
	import { Vector3 } from 'three';
	import Arc3D from './Arc3D.svelte';
	import type { Snippet } from 'svelte';
	import Latex3D from './Latex3D.svelte';
	import Line3D from './Line3D.svelte';

	type Angle3DProps = {
		vs: [Vector3, Vector3];
		origin?: Vector3;
		size?: number;
		color?: string;
		title?: string;
		lineWidth?: number;
		forceRightAngle?: boolean;
		forceRoundAngle?: boolean;
		children?: Snippet<[Vector3]>;
	};

	let {
		vs, // vectors to draw angle between
		origin = new Vector3(0, 0, 0), // common orgin of vectors
		size = 0.3, // size of drawn angle
		color = 'black', // color of used lines
		title = '',
		lineWidth = 1, // width of lines
		forceRightAngle = false, // if true draws a sharp angle, even if not 90 degrees
		forceRoundAngle = false, // if true draws a round angle, even if 90 degrees
		children
	}: Angle3DProps = $props();

	// resize vectors
	const u1 = $derived(vs[0].clone().multiplyScalar(size / vs[0].length()));
	const u2 = $derived(vs[1].clone().multiplyScalar(size / vs[1].length()));

	// labelPosition
	const labelPosition = $derived(origin.clone().add(u1.clone()).add(u2.clone()));
</script>

<!-- draw two lines to represent right angle if perpendicular, else draw an arc -->
{#if (Math.abs(u1.dot(u2)) <= 0.005 && !vs[0].equals(vs[1]) && !forceRoundAngle) || forceRightAngle}
	<Line3D
		radius={lineWidth}
		{color}
		origin={u1.clone().add(origin)}
		endPoint={u1.clone().add(u2).add(origin)}
	/>
	<Line3D
		radius={lineWidth}
		{color}
		origin={u2.clone().add(origin)}
		endPoint={u1.clone().add(u2).add(origin)}
	/>
{:else if !vs[0].equals(vs[1])}
	<Arc3D points={[u1, u2]} {color} {origin} pointsOnArc={25} />
{/if}

{#if title}
	<Latex3D latex={title} {color} position={labelPosition} />
{/if}

{#if children}
	{@render children(labelPosition)}
{/if}
