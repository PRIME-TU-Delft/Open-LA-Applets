<script lang="ts">
  import { page } from '$app/stores';

  import { T, useThrelte } from '@threlte/core';
  import { OrthographicCamera, Vector3 } from 'three';
  import { cameraStore } from '../index';

  import { parseCameraSettings } from 'utils/parseURL';
  import debounce from 'utils/debounce';

  const { renderer } = useThrelte();

  export let enablePan = false;
  export let zoom = 29; // Zoom level - For orthographic camera

  let position = new Vector3(10, 10, 10);

  function debounceSetCameraStore(camera) {
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
  position.x={position.x}
  position.y={position.y}
  position.z={position.z}
  args={[-1, 1, 1, -1, 0.1, Math.min(300, zoom * 10)]}
  makeDefault
  {zoom}
  let:ref={camera}
>
  {@const _ = cameraStore.set(camera)}
  <T.OrbitControls
    args={[camera, renderer?.domElement]}
    maxPolarAngle={Math.PI * 0.6}
    {enablePan}
    maxZoom={zoom * 10}
    minZoom={Math.max(zoom - 10, 1)}
    on:change={() => {
      debounceSetCameraStore(camera)();
    }}
  />
</T.OrthographicCamera>
