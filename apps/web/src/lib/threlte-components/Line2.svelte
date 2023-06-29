<script lang="ts">
	import { forwardEventHandlers, T, useThrelte } from '@threlte/core';
	import { Color, Vector3 } from 'three';
	import { Line2 as ThreeLine2 } from 'three/examples/jsm/lines/Line2';
	import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
	import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
	import getRandomColor from 'utils/PrimeColors';

	export let origin: Vector3 = new Vector3(0, 0, 0); // origin of vector
	export let endPoint: Vector3 = new Vector3(1, 0, 0); // direction of vector
	export let color: string = getRandomColor(); // direction of vector
	export let radius = 0.05; // direction of vector
	export let striped = false; // whether the line is striped

	const geometry = new LineGeometry();
	const material = new LineMaterial({
		color: new Color(color).getHex(),
		linewidth: radius,
		dashed: striped,
		worldUnits: true,
		dashScale: 10
	});
	$: {
		geometry.setPositions([origin.x, origin.y, origin.z, endPoint.x, endPoint.y, endPoint.z]);
		ref.computeLineDistances();
	}

	const { invalidate } = useThrelte();

	export const ref = new ThreeLine2(geometry, material);

	const component = forwardEventHandlers();
</script>

<T
	is={ref}
	let:ref
	{...$$restProps}
	bind:this={$component}
	on:change={invalidate}
	on:create={({ cleanup }) => {
		cleanup(() => {
			material.dispose();
			geometry.dispose();
		});
	}}
>
	<slot {ref} />
</T>
