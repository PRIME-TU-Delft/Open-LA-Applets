<script lang="ts">
  import { isActive } from '$lib/stores/activityStore';
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { OrthographicCamera, Vector3 } from 'three';
  import { debounce } from '$lib/utils/timeDelay';
  import { cameraStore } from '$lib/stores/cameraStore';

  export let enablePan = false;
  export let zoom = 29; // Zoom level - For orthographic camera
  export let resetKey = 0;
  export let position = new Vector3(10, 10, 10);

  function debounceSetCameraStore(camera: OrthographicCamera) {
    const position3D = camera.position;
    const zoom3D = camera.zoom;

    return debounce(() => cameraStore.updateState({ position3D, zoom3D }));
  }

  const { renderer, renderMode } = useThrelte();

  $: if ($isActive && renderer) {
    renderMode.set('on-demand');
  } else if (renderer) {
    requestAnimationFrame(() => {
      renderMode.set('manual');
    });
  }

  // TODO: Remove this
  $: console.log('load from $');
</script>

{#key $isActive}
  <T.OrthographicCamera
    makeDefault
    position={[position.x, position.y, position.z]}
    fov={15}
    {zoom}
    let:ref={camera}
    on:create={({ ref }) => {
      const camera = ref;
      const position3D = camera.position;
      const zoom3D = camera.zoom;
      cameraStore.init({ position3D, zoom3D });
      ref.lookAt(0, 0, 0);
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
