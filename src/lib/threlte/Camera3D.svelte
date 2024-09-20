<script context="module" lang="ts">
  export type Camera3DProps = {
    cameraPosition?: Vector3;
    enablePan?: boolean;
    cameraZoom?: number;
    isSplit?: boolean;
  };
</script>

<script lang="ts">
  import { activityState } from '$lib/stores/activity.svelte';
  import { Camera3D, cameraState } from '$lib/stores/camera.svelte';
  import { globalState } from '$lib/stores/globalState.svelte';
  import { debounce } from '$lib/utils/TimingFunctions';
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { Camera, OrthographicCamera, Quaternion, Vector3 } from 'three';

  let {
    enablePan = true,
    cameraZoom: zoom = 29,
    cameraPosition = new Vector3(10, 10, 10),
    isSplit = false
  }: Camera3DProps = $props();

  const { camera, advance } = useThrelte();

  const INTERVALS = 20;
  const DURATION = 750;

  let interval: number | NodeJS.Timeout;
  let doReset: number | NodeJS.Timeout;

  function onCreate({ ref }: { ref: Camera }) {
    ref.lookAt(0, 0, 0);
  }

  /**
   * Function for reseting the 3D camera to the original position and zoom
   * Do this with a smooth animation and ✨ QuAtErNiOnS ✨
   */
  function resetCamera() {
    clearInterval(interval);

    // Original values
    const originalZoom = zoom;
    const originalPosition = cameraPosition;

    // Values to move to in `INTERVALS` steps
    const cameraStore = get(camera) as OrthographicCamera;
    const currentZoom = cameraStore.zoom;
    const currentPosition = cameraStore.position;

    const zoomDelta = originalZoom - currentZoom;

    interval = setInterval(() => {
      // Find quaternion to rotate from current to original position
      const rot = new Quaternion().setFromUnitVectors(
        currentPosition.clone().normalize(),
        originalPosition.clone().normalize()
      );

      const delta = rot.slerp(new Quaternion(), 0.85); // Slerp to the original position
      currentPosition.applyQuaternion(delta); // Apply the rotation

      cameraStore.lookAt(0, 0, 0); // Keep the camera looking at the origin
      cameraStore.zoom += zoomDelta / INTERVALS; // Zoom usion the interval

      // Update the projection matrix to reflect the changes for the camera
      cameraStore.updateProjectionMatrix();

      advance(); // Manually advance the renderer
    }, DURATION / INTERVALS);

    setTimeout(() => {
      // After the `DURATION`, reset the camera to the original values to
      // make sure all values are correct, corrects rounding errors

      cameraStore.zoom = originalZoom;
      cameraStore.position.copy(originalPosition.clone());
      cameraStore.lookAt(0, 0, 0);
      cameraStore.updateProjectionMatrix();

      advance();

      clearInterval(interval);
    }, DURATION);
  }

  // Function that changes the camera State for 3D camera
  // Updates when the camera "changes"
  function handleCameraChange() {
    const cam = $camera as OrthographicCamera;

    const splitCamera3D = new Camera3D(cam);

    if (isSplit) {
      cameraState.splitCamera3D = splitCamera3D;
    } else {
      cameraState.camera3D = splitCamera3D;
    }
  }

  const debounceHandleCameraChange = debounce(handleCameraChange, 100);

  $effect(() => {
    const _ = globalState.resetKey;

    resetCamera();

    return () => clearInterval(interval);
  });

  onDestroy(() => {
    if (isSplit) cameraState.splitCamera3D = undefined;
    else cameraState.camera3D = undefined;
  });
</script>

<!-- Reset the camera when the window size changes, but only if it has not been resized within the past 100 milliseconds. -->
<svelte:window
  onresize={() => {
    clearTimeout(doReset);
    doReset = setTimeout(resetCamera, 100);
  }}
/>

<T.OrthographicCamera
  makeDefault
  position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
  fov={15}
  {zoom}
  oncreate={(e: { ref: Camera }) => onCreate(e)}
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
      onchange={() => debounceHandleCameraChange()}
      oncreate={() => debounceHandleCameraChange()}
    />
  {/if}
</T.OrthographicCamera>
