<script lang="ts">
  import { T, useThrelte } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { OrthographicCamera } from 'three';
  let rotation = 0;

  const { renderMode } = useThrelte();
  renderMode.set('manual');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleCameraChange(e: any): void {
    const cam = e?.target?.object as OrthographicCamera;

    if (!cam) return;

    cam.lookAt(0, 0, 0);

    console.log(cam.position);
    console.log(cam.zoom);
  }
</script>

<T.OrthographicCamera makeDefault position={[10, 10, 10]} fov={15} zoom={29} near={-100} far={100}>
  <OrbitControls onchange={handleCameraChange} enableDamping />
</T.OrthographicCamera>

<T.Mesh rotation.y={rotation} position.y={1}>
  <T.BoxGeometry args={[1, 2, 1]} />
  <T.MeshBasicMaterial color="hotpink" />
</T.Mesh>
