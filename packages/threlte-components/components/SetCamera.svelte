<script lang="ts">
  import { page } from '$app/stores';

  import { T, useThrelte } from '@threlte/core';
  import { Vector3 } from 'three';

  import { parseCameraSettings } from 'utils/parseURL';

  const { renderer } = useThrelte();

  export let isPerspectiveCamera = false;
  export let enableZoom = true;
  export let enablePan = false;

  let position = new Vector3(10, 10, 10);

  // Camera distances and zoom levels
  // Distance is linear and zoom is logarithmic
  let distance = 10; // Distance from the origin - For perspective camera
  let zoom = 29; // Zoom level - For orthographic camera

  $: {
    const cameraSettings = parseCameraSettings($page.url.searchParams);

    position = cameraSettings.position || position;

    isPerspectiveCamera = cameraSettings.isPerspectiveCamera || isPerspectiveCamera;
    enablePan = cameraSettings.enablePan || enablePan;
    distance = cameraSettings.distance || distance;
    zoom = cameraSettings.zoom || zoom;
  }

  $: {
    // Set the length of the position vector
    isPerspectiveCamera ? position.setLength(distance) : position.setLength(zoom);
  }
</script>

{#if isPerspectiveCamera}
  <T.PerspectiveCamera
    position.x={position.x}
    position.y={position.y}
    position.z={position.z}
    makeDefault
    maxPolarAngle={Math.PI * 0.6}
    let:ref={camera}
  >
    <T.OrbitControls
      maxDistance={distance * 1.5}
      minDistance={distance / 20}
      {enableZoom}
      {enablePan}
      args={[camera, renderer?.domElement]}
    />
  </T.PerspectiveCamera>
{:else}
  <T.OrthographicCamera
    position.x={position.x}
    position.y={position.y}
    position.z={position.z}
    args={[-1, 1, 1, -1, 0.1, Math.min(300, zoom * 10)]}
    makeDefault
    {zoom}
    let:ref={camera}
  >
    <T.OrbitControls
      args={[camera, renderer?.domElement]}
      maxPolarAngle={Math.PI * 0.6}
      {enablePan}
      {enableZoom}
      maxZoom={zoom * 10}
      minZoom={Math.max(zoom - 10, 1)}
    />
  </T.OrthographicCamera>
{/if}
