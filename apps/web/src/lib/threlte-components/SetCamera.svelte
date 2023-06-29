<script lang="ts">
	import { page } from '$app/stores';

	import { T } from '@threlte/core';
	import { OrthographicCamera, Vector3 } from 'three';
	import cameraStore from './stores/cameraStore';

	import { OrbitControls } from '@threlte/extras';
	import debounce from 'utils/debounce';
	import { parseCameraSettings } from 'utils/parseURL';

	export let enablePan = false;
	export let zoom = 29; // Zoom level - For orthographic camera

	let position = new Vector3(10, 10, 10);

	function debounceSetCameraStore(camera: OrthographicCamera) {
		return debounce(() => cameraStore.set(camera));
	}

	$: {
		const cameraSettings = parseCameraSettings($page.url.searchParams);

		position = cameraSettings.position || position;
		enablePan = cameraSettings.enablePan || enablePan;
		zoom = cameraSettings.zoom || zoom;
	}
</script>

<T.OrthographicCamera
	makeDefault
	position={[position.x, position.y, position.z]}
	rotation={[-position.x, -position.y, -position.z]}
	fov={15}
	{zoom}
	let:ref={camera}
>
	{@const _ = cameraStore.set(camera)}
	<OrbitControls
		enableZoom
		maxZoom={zoom * 10}
		minZoom={Math.max(zoom - 10, 1)}
		maxPolarAngle={Math.PI * 0.6}
		on:change={() => {
			debounceSetCameraStore(camera)();
		}}
	/>
</T.OrthographicCamera>
