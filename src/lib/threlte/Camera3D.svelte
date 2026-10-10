<script module lang="ts">
  export type Camera3DProps = {
    cameraPosition?: Vector3;
    cameraTarget?: Vector3;
    enablePan?: boolean;
    logPan?: boolean;
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
  import { onDestroy, onMount, untrack } from 'svelte';
  import { get } from 'svelte/store';
  import { OrthographicCamera, Quaternion, Vector3 } from 'three';
  import { OrbitControls as OrbitControlsJS } from 'three/addons/controls/OrbitControls.js';

  let {
    enablePan = true,
    logPan = false,
    cameraZoom: zoom = 29,
    cameraPosition = new Vector3(10, 10, 10),
    cameraTarget = new Vector3(0, 0, 0),
    isSplit = false
  }: Camera3DProps = $props();

  const { camera, advance } = useThrelte();

  const INTERVALS = 20;
  const DURATION = 750;

  // svelte-ignore state_referenced_locally
  const initialPosition: [number, number, number] = [
    cameraPosition.x,
    cameraPosition.y,
    cameraPosition.z
  ];
  // svelte-ignore state_referenced_locally
  const initialZoom = zoom;

  let interval: ReturnType<typeof setInterval>;
  let doReset: ReturnType<typeof setTimeout>;
  let orbitControlsRef = $state<OrbitControlsJS>();

  let firstLoad = true;

  /**
   * Function for reseting the 3D camera to the original position and zoom
   * Do this with a smooth animation and ✨ QuAtErNiOnS ✨
   */
  function resetCamera() {
    if (tweenFrame !== undefined) cancelAnimationFrame(tweenFrame);
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

      cameraStore.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z); // Keep the camera looking at the target
      cameraStore.zoom += zoomDelta / INTERVALS; // Zoom usion the interval

      // Update the projection matrix to reflect the changes for the camera
      cameraStore.updateProjectionMatrix();

      // OrbitControls has to be updated, because it stores camera state
      if (orbitControlsRef) {
        orbitControlsRef.update();
      }

      advance(); // Manually advance the renderer
    }, DURATION / INTERVALS);

    setTimeout(() => {
      // After the `DURATION`, reset the camera to the original values to
      // make sure all values are correct, corrects rounding errors

      cameraStore.zoom = originalZoom;
      cameraStore.position.copy(originalPosition.clone());
      cameraStore.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
      cameraStore.updateProjectionMatrix();

      // OrbitControls has to be updated, because it stores camera state
      if (orbitControlsRef) {
        orbitControlsRef.target.copy(cameraTarget);
        orbitControlsRef.update();
      }

      advance();

      clearInterval(interval);
    }, DURATION);
  }

  let tweenFrame: number | undefined;

  // svelte-ignore state_referenced_locally
  let currentTarget = cameraTarget.clone();

  function animateCameraTo(toPos: Vector3, toTarget: Vector3, toZoom: number) {
    if (tweenFrame !== undefined) cancelAnimationFrame(tweenFrame);

    const cam = get(camera) as OrthographicCamera;

    const fromTarget = orbitControlsRef ? orbitControlsRef.target.clone() : currentTarget.clone();
    const fromOffset = cam.position.clone().sub(fromTarget);
    const toOffset = toPos.clone().sub(toTarget);

    const fromR = fromOffset.length();
    const toR = toOffset.length();
    const fromDir = fromOffset.clone().normalize();
    const toDir = toOffset.clone().normalize();
    const rot = new Quaternion().setFromUnitVectors(fromDir, toDir);

    const fromZoom = cam.zoom;
    const start = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      const e = t * t * (3 - 2 * t); // smoothstep

      const dir = fromDir.clone().applyQuaternion(new Quaternion().slerp(rot, e));
      const r = fromR + (toR - fromR) * e;
      const target = fromTarget.clone().lerp(toTarget, e);

      cam.position.copy(target).addScaledVector(dir, r);
      cam.zoom = fromZoom * (toZoom / fromZoom) ** e;
      cam.updateProjectionMatrix();

      if (orbitControlsRef) {
        orbitControlsRef.target.copy(target);
        orbitControlsRef.update();
      } else {
        cam.lookAt(target);
      }
      currentTarget = target;

      const snapshot = new Camera3D(cam);
      if (isSplit) cameraState.splitCamera3D = snapshot;
      else cameraState.camera3D = snapshot;

      advance();

      tweenFrame = t < 1 ? requestAnimationFrame(step) : undefined;
    };

    tweenFrame = requestAnimationFrame(step);
  }

  // svelte-ignore state_referenced_locally
  let prevTarget = {
    position: cameraPosition.clone(),
    target: cameraTarget.clone(),
    zoom
  };

  /** Eases the camera when the cameraPosition/cameraTarget/cameraZoom props change (e.g. a SlideShow step). */
  $effect(() => {
    const pos = cameraPosition;
    const target = cameraTarget;
    const z = zoom;

    if (
      pos.equals(prevTarget.position) &&
      target.equals(prevTarget.target) &&
      z === prevTarget.zoom
    ) {
      return;
    }

    prevTarget = { position: pos.clone(), target: target.clone(), zoom: z };

    untrack(() => animateCameraTo(pos, target, z));
  });

  // Function that changes the camera State for 3D camera
  // Updates when the camera "changes"
  function handleCameraChange() {
    const cam = $camera as OrthographicCamera;

    cam.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

    const splitCamera3D = new Camera3D(cam);

    if (isSplit) {
      cameraState.splitCamera3D = splitCamera3D;
    } else {
      cameraState.camera3D = splitCamera3D;
    }
  }

  const debounceHandleCameraChange = debounce(handleCameraChange, 100);

  let targetInitialized = false;

  $effect(() => {
    if (orbitControlsRef && !targetInitialized) {
      orbitControlsRef.target.copy(cameraTarget);
      orbitControlsRef.update();
      advance();
      targetInitialized = true;
    }
  });

  $effect(() => {
    const _ = globalState.resetKey;

    // otherwise it reset after the first movement of the camera
    if (firstLoad) {
      firstLoad = false;
      return;
    }

    resetCamera();

    return () => clearInterval(interval);
  });

  onMount(() => {
    handleCameraChange();

    // Trigger initial render when in manual mode (e.g., when embedded in iframe)
    requestAnimationFrame(() => {
      advance();
    });
  });

  onDestroy(() => {
    if (tweenFrame !== undefined) cancelAnimationFrame(tweenFrame);
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
  position={initialPosition}
  fov={15}
  zoom={initialZoom}
  near={-100}
  far={100}
>
  {#if activityState.isActive}
    <OrbitControls
      bind:ref={orbitControlsRef}
      enableZoom
      {enablePan}
      maxZoom={zoom * 10}
      minZoom={Math.max(zoom / 5, 1)}
      maxPolarAngle={Math.PI * 0.6}
      onchange={() => {
        if (logPan && orbitControlsRef) {
          const { x, y, z } = orbitControlsRef.target;
          /* eslint-disable-next-line no-console */
          console.log('Pan target:', { x, y, z });
        }
        debounceHandleCameraChange();
      }}
    />
  {/if}
</T.OrthographicCamera>
