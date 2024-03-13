<script>
  import { AutoPlane, PlaneFromNormal, Vector3D } from '$lib/threlte-components';
  import { PrimeColor } from '$lib/utils/PrimeColors';
  import { T } from '@threlte/core';
  import { OrbitControls } from '@threlte/extras';
  import { Vector3 } from 'three';
  import CustomRenderer from '$lib/threlte-components/CustomRenderer.svelte';

  export let elevation = 0;
  export let azimuth = 250;
  export let grid = true;

  let position = new Vector3(10, 10, 7);
  let zoom = 40;
</script>

<PlaneFromNormal normal={new Vector3(1, 1, 1)} color={PrimeColor.red} size={12} opacity={1} />
<PlaneFromNormal normal={new Vector3(3, 1, 1)} color={PrimeColor.yellow} size={11} opacity={1} />
<PlaneFromNormal normal={new Vector3(8, 1, 1)} color={PrimeColor.darkGreen} size={10} opacity={1} />

<Vector3D
  color={PrimeColor.blue}
  length={28}
  origin={new Vector3(0, -10, 10)}
  direction={new Vector3(0, 1, -1)}
  radius={0.2}
  hideHead
/>

<T.OrthographicCamera makeDefault position={[position.x, position.y, position.z]} fov={10} {zoom}>
  <OrbitControls
    enableZoom
    maxZoom={zoom * 10}
    minZoom={Math.max(zoom - 10, 1)}
    maxPolarAngle={Math.PI * 0.6}
    autoRotate
    autoRotateSpeed={0.3}
  />
</T.OrthographicCamera>

<CustomRenderer {elevation} {azimuth} {grid} />
