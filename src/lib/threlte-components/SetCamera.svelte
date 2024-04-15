<script lang="ts">
  import { page } from '$app/stores';
  import { isActive } from '$lib/activityStore';
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { OrthographicCamera, Vector3 } from 'three';
  import { parseCameraSettings } from '$lib/utils/parseURL';
  import { debounce } from '$lib/utils/timeDelay';
  import cameraStore from './stores/cameraStore';

  export let enablePan = false;
  export let zoom = 29; // Zoom level - For orthographic camera
  export let resetKey = 0;
  export let position = new Vector3(10, 10, 10);

  function debounceSetCameraStore(camera: OrthographicCamera) {
    return debounce(() => cameraStore.set(camera));
  }

  const { renderer, renderMode } = useThrelte();

  $: {
    const cameraSettings = parseCameraSettings($page?.url?.searchParams);

    if (cameraSettings) {
      position = cameraSettings.position || position;
      enablePan = cameraSettings.enablePan || enablePan;
      zoom = cameraSettings.zoom || zoom;
    }
  }

  $: if ($isActive && renderer) {
    renderMode.set('on-demand');
  } else if (renderer) {
    requestAnimationFrame(() => {
      renderMode.set('manual');
    });
  }
</script>

{#key resetKey && $isActive}
  <T.OrthographicCamera
    makeDefault
    position={[position.x, position.y, position.z]}
    fov={15}
    {zoom}
    let:ref={camera}
    on:create={({ ref }) => {
      cameraStore.set(ref);
      ref.lookAt(new Vector3(0, 0, 0));
    }}
  >
    {#if $isActive}
      <OrbitControls
        enableZoom
        {enablePan}
        maxZoom={zoom * 10}
        minZoom={Math.max(zoom - 10, 1)}
        maxPolarAngle={Math.PI * 0.6}
        on:create={() => debounceSetCameraStore(camera)()}
        on:change={() => debounceSetCameraStore(camera)()}
      />
    {/if}
  </T.OrthographicCamera>
{/key}
