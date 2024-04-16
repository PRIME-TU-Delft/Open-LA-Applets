<script lang="ts">
  import { isActive } from '$lib/stores/activityStore';
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { Vector3 } from 'three';
  import { debounce } from '$lib/utils/timeDelay';
  import { cameraStore, type Camera3DState } from '$lib/stores/cameraStore';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { setPosition, setZoom } from '$lib/utils/parseUrl';

  export let enablePan = false;
  export let zoom = 29; // Zoom level - For orthographic camera
  export let position = new Vector3(10, 10, 10);

  const debounceCameraStore = debounce((state: Camera3DState) => {
    cameraStore.updateState(state);
  }, 1000);

  const { renderer, renderMode } = useThrelte();

  $: if ($isActive && renderer) {
    renderMode.set('on-demand'); // The scene will play and update when mouse is dragging
  } else if (renderer) {
    requestAnimationFrame(() => {
      renderMode.set('manual'); // The scene is paused
    });
  }

  onMount(() => {
    const url = $page?.url;

    if (!url) return;

    // Set the position / zoom level for the camera
    setPosition(url.searchParams);
    setZoom(url.searchParams);

    if ('position3D' in $cameraStore) position = $cameraStore.position3D;

    if ('zoom3D' in $cameraStore) zoom = $cameraStore.zoom3D;
  });
</script>

{#key position.x + position.y + position.z + zoom}
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
          on:create={() =>
            debounceCameraStore({ position3D: camera.position, zoom3D: camera.zoom })}
          on:change={() =>
            debounceCameraStore({ position3D: camera.position, zoom3D: camera.zoom })}
        />
      {/if}
    </T.OrthographicCamera>
  {/key}
{/key}
