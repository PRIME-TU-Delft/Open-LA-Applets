<script context="module" lang="ts">
	export type Camera3DProps = {
		cameraPosition?: Vector3;
		enablePan?: boolean;
		cameraZoom?: number;
	};
</script>

<script lang="ts">
	import { activityState } from '$lib/stores/activity.svelte';
	import { globalState } from '$lib/stores/globalState.svelte';
	import { T, useThrelte } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Camera, OrthographicCamera, Quaternion, Vector3 } from 'three';

	let {
		enablePan = true,
		cameraZoom: zoom = 29,
		cameraPosition = new Vector3(10, 10, 10)
	}: Camera3DProps = $props();

	const { camera, advance } = useThrelte();

	const INTERVALS = 20;
	const DURATION = 750;

	function onCreate({ ref }: { ref: Camera }) {
		ref.lookAt(0, 0, 0);
	}

	$effect(() => {
		const _ = globalState.resetKey;

		// Original values
		const originalZoom = zoom;
		const originalPosition = cameraPosition;

		// Values to move to in `INTERVALS` steps
		const camera = $camera as OrthographicCamera;
		const currentZoom = camera.zoom;
		const currentPosition = camera.position;

		const zoomDelta = originalZoom - currentZoom;

		const interval = setInterval(() => {
			// Find quaternion to rotate from current to original position
			const rot = new Quaternion().setFromUnitVectors(
				currentPosition.clone().normalize(),
				originalPosition.clone().normalize()
			);

			const delta = rot.slerp(new Quaternion(), 0.85); // Slerp to the original position
			currentPosition.applyQuaternion(delta); // Apply the rotation

			camera.lookAt(0, 0, 0); // Keep the camera looking at the origin
			camera.zoom += zoomDelta / INTERVALS; // Zoom usion the interval

			// Update the projection matrix to reflect the changes for the camera
			camera.updateProjectionMatrix();

			advance(); // Manually advance the renderer
		}, DURATION / INTERVALS);

		setTimeout(() => {
			// After the `DURATION`, reset the camera to the original values to
			// make sure all values are correct, corrects rounding errors

			camera.zoom = originalZoom;
			camera.position.copy(originalPosition.clone());
			camera.lookAt(0, 0, 0);
			camera.updateProjectionMatrix();

			advance();

			clearInterval(interval);
		}, DURATION);

		return () => clearInterval(interval);
	});
</script>

<T.OrthographicCamera
	makeDefault
	position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
	fov={15}
	{zoom}
	oncreate={(e: {ref: Camera}) => onCreate(e)}
	near={-100}
	far={100}
>
	{#if activityState.isActive}
		<OrbitControls
			enableZoom
			{enablePan}
			maxZoom={zoom * 10}
			minZoom={Math.max(zoom / 5, 1)}
			maxPolarAngle={Math.PI * 0.6}
		/>
	{/if}
</T.OrthographicCamera>
